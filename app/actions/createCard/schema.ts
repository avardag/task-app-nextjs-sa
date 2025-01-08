import { z } from "zod";

const CreateCardSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title must be 3 chars long",
    }),
  boardId: z.string(),
  listId: z.string(),
});

export default CreateCardSchema;
