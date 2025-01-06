import { z } from "zod";

const UpdateListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title must be 3 chars long",
    }),
  id: z.string(),
  boardId: z.string(),
});

export default UpdateListSchema;
