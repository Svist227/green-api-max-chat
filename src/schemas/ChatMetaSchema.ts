import * as z from "zod";
import { MemberInfoSchema } from "./MemberInfoSchema";
import { Timestamp } from "firebase/firestore"


export const ChatMetaSchema = z.object({
      lastMessage: z.string(),
      membersInfo: z.record(z.string(), MemberInfoSchema),
      members: z.array(z.string()),
      updatedAt: z.instanceof(Timestamp),
    })