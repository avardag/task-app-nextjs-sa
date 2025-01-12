"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import CopyCardSchema from "./schema";
import { createAuditLog } from "@/lib/createAuditLog";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

async function copyCardHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { id, boardId } = data;

  let card;
  try {
    const cardTocopy = await prisma.card.findUnique({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
    });

    if (!cardTocopy) {
      return {
        error: "Card not found",
      };
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId: cardTocopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newPosition = lastCard ? lastCard.order + 1 : 1;

    //create a new card copying all the values from cardTocopy
    card = await prisma.card.create({
      data: {
        title: `${cardTocopy.title} - copy`,
        description: cardTocopy.description,
        order: newPosition,
        listId: cardTocopy.listId,
      },
    });

    //create log
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failded to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const copyCard = createSafeAction(CopyCardSchema, copyCardHandler);
