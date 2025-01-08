import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { createCard } from "@/app/actions/createCard";
import { useAction } from "@/app/hooks/useAction";
import { FormSubmit } from "@/components/form/FormSubmit";
import FormTextarea from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}
const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created`);
        disableEditing();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e,
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const boardId = params.boardId as string;
      const listId = formData.get("listId") as string;

      execute({ title, boardId, listId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter title for this card..."
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" defaultValue={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          size="sm"
          variant="ghost"
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  },
);

CardForm.displayName = "CardForm";
export default CardForm;
