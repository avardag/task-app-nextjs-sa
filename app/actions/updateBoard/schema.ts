import { z } from "zod";

const UpdateBoardSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title must be 3 chars long",
    }),
  id: z.string(),
});

export default UpdateBoardSchema;
