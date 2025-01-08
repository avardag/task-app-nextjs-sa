import { Card } from "@prisma/client";
export default function CardItem({
  data,
  index,
}: {
  data: Card;
  index: number;
}) {
  return (
    <div
      role="button"
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    >
      {data.title}
    </div>
  );
}
