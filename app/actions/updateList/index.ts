"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import UpdateListSchema from "./schema";
import { createAuditLog } from "@/lib/createAuditLog";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

async function updateListHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }

  const { title, id, boardId } = data;

  let list;
  try {
    list = await prisma.list.update({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      data: {
        title,
      },
    });
    //create log
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failded to update",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const updateList = createSafeAction(UpdateListSchema, updateListHandler);
