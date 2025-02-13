//V:3 using generic createAction function
"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import CreateBoardSchema from "./schema";
import { createAuditLog } from "@/lib/createAuditLog";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

async function createHandler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUserName
  ) {
    return { error: "Missing fields. Failed to create Board" };
  }
  let board;

  try {
    board = await prisma.board.create({
      data: {
        title,
        orgId,
        imageFullUrl,
        imageThumbUrl,
        imageId,
        imageLinkHtml,
        imageUserName,
      },
    });

    //create log
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Database error",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
}

export const createBoard = createSafeAction(CreateBoardSchema, createHandler);

// V:1
// "use server";
// import prisma from "@/lib/db";
//
// export async function create(formData: FormData) {
//   const title = formData.get("title") as string;
//
//   await prisma.board.create({
//     data: { title },
//   });
// }
// V:2 using validation:
// "use server";
// import { z } from "zod";
// import prisma from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
//
// //errors state for form
// export interface FormState {
//   errors?: {
//     title?: string[];
//   };
//   message?: string | null;
// }
// const CreateBoard = z.object({
//   title: z.string().min(3, {
//     message: "Minimum 3 chars required",
//   }),
// });
//
// export async function create(prevState: FormState, formData: FormData) {
//   const validatedFields = CreateBoard.safeParse({
//     title: formData.get("title"),
//   });
//
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing fields",
//     };
//   }
//
//   const { title } = validatedFields.data;
//
//   try {
//     await prisma.board.create({
//       data: { title },
//     });
//   } catch (error) {
//     return {
//       message: "Database error",
//     };
//   }
//
//   revalidatePath("/organization/org_2m6PPar6rZcy50m7lyTU9UgUjY5");
//   redirect("/organization/org_2m6PPar6rZcy50m7lyTU9UgUjY5");
// }
