import { z } from "zod";
import CreateBoardSchema from "./schema";
import { ActionState } from "@/lib/createSafeAction";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof CreateBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
