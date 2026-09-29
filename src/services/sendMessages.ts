import { z } from 'zod'

export const SendMessageSchema = z.object({
    chatId: z.string().trim().min(1, 'Не выбран чат'),
    message: z.string()
        .max(4096, 'Максимальная длина сообщения — 4096 символов')
        .refine(text => text.trim().length > 0, 'Введите текст сообщения'),
})

export const SendMessageResponseSchema = z.object({
    idMessage: z.string().min(1),
})

type SendMessageInput = z.infer<typeof SendMessageSchema>

export const SendMessages = async (input: SendMessageInput, accountKey: string) => {
    const data = SendMessageSchema.parse(input)

    const res = await fetch(`/api/chats/${encodeURIComponent(data.chatId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-instance-key': accountKey },
        body: JSON.stringify({ message: data.message }),
    })

    const result = await res.json()

    if (!res.ok) {
        const error = z.object({ message: z.string() }).safeParse(result)
        throw new Error(error.success ? error.data.message : 'Не удалось отправить сообщение')
    }

    const response = SendMessageResponseSchema.safeParse(result)
    if (!response.success) {
        throw new Error('Сервер не вернул идентификатор сообщения')
    }

    return response.data
}
