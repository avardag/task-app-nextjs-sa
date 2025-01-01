"use client";
import { deleteBoard } from "@/app/actions/deleteBoard/index";
import { useAction } from "@/app/hooks/useAction";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

export default function BoardOptions({ id }: { id: string }) {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => toast.error(error),
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-3 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={() => execute({ id })}
          className="rounded-sm w-full h-auto p-2 px-5 justify-center font-normal text-sm"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
}
