import { Board } from "@prisma/client";
import BoardTitleForm from "./BoardTitleForm";
import BoardOptions from "./BoardOptions";

export default async function BoardNavbar({ data }: { data: Board }) {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-6 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
}
