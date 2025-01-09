import { z } from "zod";

const UpdateListOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  // id: z.string(),
  boardId: z.string(),
});

export default UpdateListOrderSchema;
