"use client";

import { copyCard } from "@/app/actions/copyCard";
import { deleteCard } from "@/app/actions/deleteCard";
import { useAction } from "@/app/hooks/useAction";
import { useCardModal } from "@/app/hooks/useCardModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function CardActions({ data }: { data: CardWithList }) {
  const params = useParams();
  const cardModal = useCardModal();
  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" updated`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const handleCopy = () => {
    const boardId = params.boardId as string;
    executeCopy({ id: data.id, boardId });
  };

  const handleDelete = () => {
    const boardId = params.boardId as string;
    executeDelete({ id: data.id, boardId });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-semibold">Actions</p>
      <Button
        onClick={handleCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <CopyIcon className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <CopyIcon className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}

CardActions.Skeleton = function CardActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
