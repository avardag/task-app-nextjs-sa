import { z } from "zod";
import UpdateBoardSchema from "./schema";
import { ActionState } from "@/lib/createSafeAction";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof UpdateBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
