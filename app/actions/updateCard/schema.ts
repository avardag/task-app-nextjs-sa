import { z } from "zod";

const UpdateCardSchema = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, {
        message: "Title must be 3 chars long",
      }),
  ),
  id: z.string(),
  boardId: z.string(),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(3, { message: "Description needs 3 chars" }),
  ),
});

export default UpdateCardSchema;
