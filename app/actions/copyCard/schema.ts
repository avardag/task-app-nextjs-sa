import { z } from "zod";

const CopyCardSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export default CopyCardSchema;
