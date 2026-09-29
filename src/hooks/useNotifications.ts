import type { Chat } from '@/types/chat'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { NotificationResponseSchema, RawMessageSchema, type RawMessage } from '@/schemas/MessageSchema'
import { mergeMessages } from '@/hooks/useMergedMessages'
import { useMessageUi } from '@/store/StateManagment'

async function requestNotification(method: 'GET' | 'DELETE', signal: AbortSignal, receiptId?: number) {
    const res = await fetch('/api/notifications', {
        method,
        signal,
        cache: 'no-store',
        ...(method === 'DELETE' && {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiptId }),
        }),
    })
    const data: unknown = await res.json()
    if (!res.ok) {
        const error = z.object({ message: z.string() }).safeParse(data)
        throw new Error(error.success ? error.data.message : 'Ошибка получения уведомлений', { cause: res.status })
    }
    return data
}

export const useNotifications = () => {
    const { status } = useSession()
    const queryClient = useQueryClient()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status !== 'authenticated') return
        if (!navigator.locks || typeof BroadcastChannel === 'undefined') {
            setError('Для получения уведомлений нужен браузер с поддержкой Web Locks и BroadcastChannel')
            return
        }

        const controller = new AbortController()
        const { signal } = controller
        const channel = new BroadcastChannel('green-notifications')
        const pause = (ms: number) => new Promise<void>(resolve => {
            const finish = () => {
                clearTimeout(timer)
                signal.removeEventListener('abort', finish)
                resolve()
            }
            const timer = setTimeout(finish, ms)
            signal.addEventListener('abort', finish, { once: true })
            if (signal.aborted) finish()
        })

        const applyMessage = async (message: RawMessage) => {
            // Ждём ID из ответа отправки, чтобы не показывать рядом временную и серверную копии.
            while (!signal.aborted && message.type === 'outgoing' &&
                useMessageUi.getState().messages[message.chatId]?.some(item => item.idMessage.startsWith('temp-'))) {
                await pause(100)
            }
            if (signal.aborted) return

            queryClient.setQueryData<RawMessage[]>(['messages', message.chatId], current =>
                mergeMessages([message], current || []),
            )
            const chats = queryClient.getQueryData<Chat[]>(['users'])
            if (!chats?.some(chat => chat.chatId === message.chatId)) {
                void queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
            }
        }

        channel.onmessage = event => {
            const message = RawMessageSchema.safeParse(event.data)
            if (message.success) void applyMessage(message.data)
        }

        const receive = async () => {
            let retryDelay = 1000
            while (!signal.aborted) {
                try {
                    const data = await requestNotification('GET', signal)
                    if (signal.aborted) return
                    const notification = NotificationResponseSchema.nullable().safeParse(data)
                    if (!notification.success) throw new Error('Некорректный ответ уведомлений')

                    if (notification.data) {
                        const { receiptId, message } = notification.data
                        if (message) {
                            await applyMessage(message)
                            if (signal.aborted) return
                            channel.postMessage(message)
                        }
                        // Подтверждаем только после обновления кеша или пропуска неподдерживаемого события.
                        await requestNotification('DELETE', signal, receiptId)
                    }
                    setError(null)
                    retryDelay = 1000
                    await pause(1000)
                } catch (error) {
                    if (signal.aborted) return
                    setError(error instanceof Error ? error.message : 'Ошибка получения уведомлений')
                    if (error instanceof Error && error.cause === 401) return
                    if (error instanceof Error && error.cause === 429) retryDelay = Math.max(retryDelay, 5000)
                    await pause(retryDelay)
                    retryDelay = Math.min(retryDelay * 2, 30000)
                }
            }
        }

        // Одна вкладка читает очередь, остальные получают сообщения через BroadcastChannel.
        void navigator.locks.request('green-notifications', { signal }, receive).catch(() => {
            if (!signal.aborted) setError('Не удалось запустить получение уведомлений')
        })

        return () => {
            controller.abort()
            channel.close()
        }
    }, [status, queryClient])

    return { error }
}
