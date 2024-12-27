import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

/**
 * A higher-order function that creates a safe action handler.
 * It validates the input data against a Zod schema before executing the handler function. *
 *
 * It returns a new action function that performs the following steps:
 *  1. Validates the input data using the provided Zod schema.
 *  2. If validation passes, calls the action handler function with the sanitized data.
 *  3. Handles errors during validation or action execution, returning an object with appropriate error information.
 *
 * @param schema: The Zod schema to validate the input data against.
 * @param handlerFn: The action handler function that performs the asynchronous operation.
 *   - `validatedData`: The sanitized data after successful validation.
 *
 * @returns A new action function with Zod validation and error handling.
 */
export function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handlerFn: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>,
) {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handlerFn(validationResult.data);
  };
}
