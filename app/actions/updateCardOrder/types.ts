import { z } from "zod";
import UpdateCardOrderSchema from "./schema";
import { ActionState } from "@/lib/createSafeAction";
import { Card } from "@prisma/client";

export type InputType = z.infer<typeof UpdateCardOrderSchema>;
export type ReturnType = ActionState<InputType, Card[]>;
