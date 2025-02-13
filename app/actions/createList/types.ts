import { z } from "zod";
import CreateListSchema from "./schema";
import { ActionState } from "@/lib/createSafeAction";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof CreateListSchema>;
export type ReturnType = ActionState<InputType, List>;
