"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import UpdateCardOrderSchema from "./schema";

async function updateCardOrderHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { items, boardId } = data;

  let updatedCards;
  try {
    const transaction = items.map((card) =>
      prisma.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      }),
    );

    updatedCards = await prisma.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failded to reorder",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
}

export const updateCardOrder = createSafeAction(
  UpdateCardOrderSchema,
  updateCardOrderHandler,
);
