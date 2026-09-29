import { RawMessageSchema } from "@/schemas/MessageSchema"
import { Timestamp } from "firebase/firestore"
import { z } from "zod"


export type RawMessage  = z.infer<typeof RawMessageSchema>




