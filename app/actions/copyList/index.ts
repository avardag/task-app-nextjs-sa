"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import CopyListSchema from "./schema";

async function copyListHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { id, boardId } = data;

  let list;
  try {
    const listTocopy = await prisma.list.findUnique({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      include: { cards: true },
    });

    if (!listTocopy) {
      return {
        error: "List not found",
      };
    }

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newPosition = lastList ? lastList.order + 1 : 1;

    //create a new list copying all the values from listTocopy
    list = await prisma.list.create({
      data: {
        boardId: listTocopy.boardId,
        title: `${listTocopy.title} - Copy`,
        order: newPosition,
        cards: {
          createMany: {
            data: listTocopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: "Failded to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const copyList = createSafeAction(CopyListSchema, copyListHandler);
