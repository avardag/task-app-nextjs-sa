"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import UpdateBoardSchema from "./schema";

async function updateHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { title, id } = data;

  let board;
  try {
    board = await prisma.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Failded to update",
    };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoardSchema, updateHandler);
