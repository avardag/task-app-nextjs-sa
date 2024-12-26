import { deleteBoard } from "@/app/actions/deleteBoard";
import FormDelete from "./formDelete";

interface BoardProps {
  id: string;
  title: string;
}
export default function Board({ id, title }: BoardProps) {
  const deleteBoardWithId = deleteBoard.bind(null, id);
  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board title: {title}</p>
      <FormDelete />
    </form>
  );
}
