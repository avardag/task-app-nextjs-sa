import { z } from "zod";
import DeleteBoardSchema from "./schema";
import { ActionState } from "@/lib/createSafeAction";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
