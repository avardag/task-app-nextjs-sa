import { z } from "zod";

const CopyListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export default CopyListSchema;
