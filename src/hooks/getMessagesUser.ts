import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usesChatStore } from '@/store/chat-selection.store'
import { RawMessage } from '@/types/message'
import { RawMessagesSchema } from '@/schemas/MessageSchema'
import { mergeMessages } from '@/hooks/useMergedMessages'

async function getMessagesHistoryUser(
    chatId: string,
    signal?: AbortSignal
): Promise<RawMessage[]> {

    const res = await fetch(
        `/api/chats/${encodeURIComponent(chatId)}/messages`,
        {
            signal,
            headers: { 'x-instance-key': usesChatStore.getState().accountKey || '' },
        }
    )

    if (!res.ok) {
        throw new Error('Не удалось получить сообщения')
    }

    const data = await res.json()

    return RawMessagesSchema.parse(data)
}


// Получение истории сообщений
export const useGetMessagesUser = () => {
    const queryClient = useQueryClient()

    const selectedUser = usesChatStore(
        state => state.selectedUser
    )

    const query = useQuery({
        queryKey: [
            'messages',
            selectedUser?.chatId
        ],

        queryFn: async ({ signal }) => {
            const chatId = selectedUser!.chatId
            const history = await getMessagesHistoryUser(chatId, signal)
            // За время запроса в кеш могли прийти новые сообщения.
            return mergeMessages(history, queryClient.getQueryData<RawMessage[]>(['messages', chatId]) || [])
        },

        enabled: !!selectedUser?.chatId,
        // Кеш, заполненный уведомлением, ещё не содержит полную историю чата.
        staleTime: 0,
    })

    return query
}
