'use client'
import { useQuery } from '@tanstack/react-query'

let avatarRequest: Promise<unknown> = Promise.resolve()

async function getAvatar(chatId: string): Promise<{ urlAvatar: string }> {
    const request = avatarRequest.then(async () => {
        // Запрашиваем фото по одному, чтобы не превышать лимит GREEN API.
        await new Promise(resolve => setTimeout(resolve, 150))

        const res = await fetch(`/api/avatar?chatId=${encodeURIComponent(chatId)}`)
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Не удалось загрузить аватарку')
        }

        return data
    })

    avatarRequest = request.catch(() => undefined)
    return request
}

export const useChatAvatar = (chatId: string) => {
    const query = useQuery({
        queryKey: ['chat-avatar', chatId],
        queryFn: () => getAvatar(chatId),
        enabled: !!chatId,
        staleTime: 10 * 60 * 1000,
        retry: false,
    })

    return query
}
