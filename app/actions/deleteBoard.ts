"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBoard(id: string) {
  await prisma.board.delete({
    where: { id },
  });

  revalidatePath("/organization/org_2m6PPar6rZcy50m7lyTU9UgUjY5");
}
