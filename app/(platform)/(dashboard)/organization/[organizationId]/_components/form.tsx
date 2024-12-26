"use client";

import { create, FormState } from "@/app/actions/createBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";

export default function Form() {
  const initialState: FormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(create, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={dispatch}>
      <div className="flex flex-col space-y-2">
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter a board title"
          disabled={pending}
        />
        {state?.errors?.title ? (
          <div>
            {state.errors.title.map((error) => (
              <p key={error} className="text-red-400">
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <Button disabled={pending}>Submit</Button>
      </div>
    </form>
  );
}
