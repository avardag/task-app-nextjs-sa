import prisma from "@/lib/db";
import Board from "./_components/board";
import Form from "./_components/form";
// import { auth } from "@clerk/nextjs/server";

async function OrganizationIdPage() {
  const boards = await prisma.board.findMany();
  return (
    <div className="flex flex-col space-y-4;">
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} id={board.id} title={board.title} />
        ))}
      </div>
    </div>
  );
}

export default OrganizationIdPage;
