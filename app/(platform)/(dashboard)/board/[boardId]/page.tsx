import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ListContainer from "./_components/ListContainer";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();
  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await prisma.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc", //order here is a table col
        },
      },
    },
    orderBy: {
      order: "asc", //order is a table col
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      {/* here the data prop is giving type error */}
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
}
