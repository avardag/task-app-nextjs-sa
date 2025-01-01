import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/BoardNavbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();
  if (!orgId) {
    return {
      title: "Board",
    };
  }
  const board = await prisma.board.findUnique({
    where: { id: params.boardId, orgId },
  });

  return {
    title: board?.title || "Board",
  };
}
export default async function BoardIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await prisma.board.findUnique({
    where: { id: params.boardId, orgId },
  });

  if (!board) {
    notFound();
  }
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute pt-28 h-full" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}
