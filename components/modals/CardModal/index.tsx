"use client";
import { useCardModal } from "@/app/hooks/useCardModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import Description from "./Description";
import CardActions from "./CardActions";
import { AuditLog } from "@prisma/client";
import Activity from "./Activity";

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

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: async () => {
      const res = await fetch(`/api/cards/${id}/logs`);
      return res.json();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Card</DialogTitle>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="bg-white">
        {cardData ? <Header data={cardData} /> : <Header.Skeleton />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {cardData ? (
                <Description data={cardData} />
              ) : (
                <Description.Skeleton />
              )}
              {auditLogsData ? (
                <Activity items={auditLogsData} />
              ) : (
                <Activity.Skeleton />
              )}
            </div>
          </div>
          {cardData ? (
            <CardActions data={cardData} />
          ) : (
            <CardActions.Skeleton />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
