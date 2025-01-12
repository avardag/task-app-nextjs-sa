"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import CreateCardSchema from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/createAuditLog";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

async function createcardHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { title, listId, boardId } = data;

  let card;
  try {
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });

    if (!list) {
      return {
        error: "list not found",
      };
    }
    //get the last card to assign a order value to the card to be created
    const lastcard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastcard ? lastcard.order + 1 : 1;
    //create the card
    card = await prisma.card.create({
      data: {
        title,
        listId,
        order: newOrder,
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
      error: "Failded to create",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const createCard = createSafeAction(CreateCardSchema, createcardHandler);
