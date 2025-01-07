import { z } from "zod";

const DeleteListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export default DeleteListSchema;
