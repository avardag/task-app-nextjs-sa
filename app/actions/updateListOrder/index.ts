"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import UpdateListOrderSchema from "./schema";

async function updateListOrderHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { items, boardId } = data;

  let lists;
  try {
    const transaction = items.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
          board: { orgId },
        },
        data: {
          order: list.order,
        },
      }),
    );

    lists = await prisma.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failded to reorder",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: lists };
}

export const updateListOrder = createSafeAction(
  UpdateListOrderSchema,
  updateListOrderHandler,
);
