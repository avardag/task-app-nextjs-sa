"use client";
import { useRef, ElementRef } from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { useAction } from "@/app/hooks/useAction";
import { createBoard } from "@/app/actions/createBoard";
import { FormInput } from "./FormInput";
import { FormSubmit } from "./FormSubmit";
import { toast } from "sonner";
import FormPicker from "./formPicker";
import { useRouter } from "next/navigation";

interface FormPopOverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export default function FormPopover({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopOverProps) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const router = useRouter();
  const { execute, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created");
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => toast.error(error),
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string; //from FormPicker component
    execute({ title, image });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        sideOffset={sideOffset}
        side={side}
      >
        <div className="tect-sm font-medium text-center text-neutral-600">
          Create Board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full"> Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
