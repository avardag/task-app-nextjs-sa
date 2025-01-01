import { z } from "zod";

const DeleteBoardSchema = z.object({
  id: z.string(),
});

export default DeleteBoardSchema;
