import * as z from "zod";
import { OtherUserInfoSchema } from "./OtherUserInfoSchema";

export const ChatItemSchema = z.object({
    chatId: z.string(),
    otherUser: OtherUserInfoSchema,
    lastMessage: z.string(),
    time: z.union([z.string(), z.null()])
})

export type ChatItem = z.infer<typeof ChatItemSchema>
