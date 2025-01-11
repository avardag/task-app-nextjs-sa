"use client";
import { useCardModal } from "@/app/hooks/useCardModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";

export default function CardModal() {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: async () => {
      const res = await fetch(`/api/cards/${id}`);
      return res.json();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Card</DialogTitle>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="bg-slate-200">
        {cardData ? <Header data={cardData} /> : <Header.Skeleton />}
      </DialogContent>
    </Dialog>
  );
}
