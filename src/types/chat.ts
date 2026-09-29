import { z } from 'zod'
import type { Messenger } from '@/constants/url'

export const ChatSchema = z.object({
    chatId: z.string().min(1),
    name: z.string().default(''),
    type: z.enum(['user', 'group', 'supergroup', 'channel', 'bot']),
    phoneNumber: z.number().nullish().transform(value => value || null),
    username: z.string().nullish().transform(value => value || null),
    isSelf: z.boolean().optional(),
})

export type Chat = z.infer<typeof ChatSchema>

declare module 'next-auth' {
    interface Session {
        instance?: { idInstance: string; messenger: Messenger }
    }
}
