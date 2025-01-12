import { z } from "zod";

const DeleteCardSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export default DeleteCardSchema;
