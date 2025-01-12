"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import DeleteCardSchema from "./schema";

async function deleteCardHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { id, boardId } = data;

  let card;
  try {
    card = await prisma.card.delete({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const deleteCard = createSafeAction(DeleteCardSchema, deleteCardHandler);
