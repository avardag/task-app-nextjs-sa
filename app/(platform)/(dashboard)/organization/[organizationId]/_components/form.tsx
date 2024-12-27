"use client";

import { createBoard } from "@/app/actions/createBoard";
import { useAction } from "@/app/hooks/useAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Form() {
  // const initialState = { message: null, errors: {} };
  // const [state, dispatch] = useFormState(createBoard, initialState);
  // const { pending } = useFormStatus();

  const { execute, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => console.log(data, "Success!"),
    onError: (error) => console.log(error),
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    execute({ title });
  };
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter a board title"
          disabled={isLoading}
        />
        {fieldErrors?.title ? (
          <div>
            {fieldErrors?.title.map((error) => (
              <p key={error} className="text-red-400">
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <Button disabled={isLoading}>Submit</Button>
      </div>
    </form>
  );
}
