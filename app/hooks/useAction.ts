import { useState, useCallback } from "react";
import { ActionState, FieldErrors } from "@/lib/createSafeAction";

// Type definition for the action function
type Action<TInput, TOutput> = (
  data: TInput,
) => Promise<ActionState<TInput, TOutput>>;

// Interface for options that can be passed to useAction hook
interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

/**
 * A custom React hook that simplifies handling asynchronous actions with error handling, loading state, and optional success and completion callbacks.
 *
 * This hook takes an action function that performs the asynchronous operation and an optional options object to configure callbacks and initial state.
 *
 * It returns an object containing functions and state variables to manage the action execution, including:
 *  - `execute`: Triggers the asynchronous action with provided input data.
 *  - `fieldErrors`: Holds validation errors from the action execution (if any).
 *  - `error`: Contains a general error message if the action encounters an unexpected error.
 *  - `data`: Stores the returned data from a successful action execution.
 *  - `isLoading`: Indicates whether the action is currently running.
 *
 * @param action: The asynchronous action function to execute.
 * @param options: An optional object to configure behavior with callbacks and initial state.
 *   - `onSuccess`: A function to be called when the action succeeds with the returned data.
 *   - `onError`: A function to be called when the action encounters an error with the error message.
 *   - `onComplete`: A function to be called when the action finishes, regardless of success or failure.
 *
 * @returns An object containing functions and state variables for managing the action.
 */
export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {},
) => {
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<TInput> | undefined
  >(undefined);
  // State to store generic error messages
  const [error, setError] = useState<string | undefined>(undefined);
  // State to store the result data
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Function to execute the action with proper error handling and state management.
   * @param input - The input data to pass to the action function.
   */
  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      try {
        const result = await action(input);

        if (!result) {
          return;
        }

        setFieldErrors(result.fieldErrors);

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options],
  );
  // Return the state and the execute function
  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};
