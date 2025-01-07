"use client";
import { List } from "@prisma/client";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { FormSubmit } from "@/components/form/FormSubmit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/app/hooks/useAction";
import { deleteList } from "@/app/actions/deleteList";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/app/actions/copyList";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}
export default function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  //delete useAction
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  //copy useAction
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const boardId = formData.get("boardId") as string;
    const id = formData.get("id") as string;

    executeDelete({ boardId, id });
  };

  const onCopy = (formData: FormData) => {
    const boardId = formData.get("boardId") as string;
    const id = formData.get("id") as string;

    executeCopy({ boardId, id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2 " variant="ghost">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="px-0 pt-3 pb-3">
        <div className="tect-sm font-medium text-center text-neutral-600 pb-4">
          List Options
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
