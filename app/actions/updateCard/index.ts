"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import UpdateCardSchema from "./schema";

async function updateHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { boardId, id, ...values } = data;

  let card;
  try {
    card = await prisma.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Failded to update",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const updateCard = createSafeAction(UpdateCardSchema, updateHandler);
