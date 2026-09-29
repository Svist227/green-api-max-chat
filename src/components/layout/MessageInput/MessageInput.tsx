import './MessageInput.scss'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UiMessageSchema, useMessageUi } from '@/store/StateManagment'
import { SendMessages, SendMessageSchema } from '@/services/sendMessages'
import { IconSend } from './icons'
import { usesChatStore } from '@/store/chat-selection.store'

const MessageInput = () => {
    const [drafts, setDrafts] = useState<Record<string, string>>({})
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<{ chatId: string; message: string } | null>(null)
    const selectedUser = usesChatStore(state => state.selectedUser)
    const addMessage = useMessageUi(state => state.addMessage)
    const confirmMessage = useMessageUi(state => state.confirmMessage)
    const removeMessage = useMessageUi(state => state.removeMessage)
    const queryClient = useQueryClient()

    const chatId = selectedUser?.chatId || ''
    const value = drafts[chatId] || ''

    const handleClick = async () => {
        if (!selectedUser || isSending) return

        const payload = SendMessageSchema.safeParse({ chatId, message: value })
        if (!payload.success) {
            setError({ chatId, message: payload.error.issues[0].message })
            return
        }

        const tempId = `temp-${crypto.randomUUID()}`
        const optimistic = UiMessageSchema.safeParse({
            idMessage: tempId,
            chatId,
            chatType: selectedUser.type,
            type: 'outgoing',
            typeMessage: 'textMessage',
            textMessage: payload.data.message,
            timestamp: Date.now(),
        })

        if (!optimistic.success) {
            setError({ chatId, message: 'Некорректные данные сообщения или чата' })
            return
        }

        addMessage(optimistic.data)
        setDrafts(current => ({ ...current, [chatId]: '' }))
        setError(null)
        setIsSending(true)

        try {
            const result = await SendMessages(payload.data)
            confirmMessage(chatId, tempId, result.idMessage)
        } catch (error) {
            removeMessage(chatId, tempId)
            setDrafts(current => ({ ...current, [chatId]: current[chatId] || payload.data.message }))
            setError({
                chatId,
                message: error instanceof Error ? error.message : 'Не удалось отправить сообщение',
            })
            return
        } finally {
            setIsSending(false)
        }

        // Обновляем историю после подтверждения, не удаляя локальное сообщение.
        void queryClient.invalidateQueries({ queryKey: ['messages', chatId], exact: true })
    }

    const handleEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            void handleClick()
        }
    }

    const autoResize = (event: FormEvent<HTMLTextAreaElement>) => {
        const textarea = event.currentTarget
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight - 6}px`
    }

    return (
        <div className="input">
            <div className="input-wrap">
                <textarea
                    className="input-inner"
                    placeholder="Написать сообщение..."
                    rows={1}
                    maxLength={4096}
                    value={value}
                    disabled={!chatId || isSending}
                    onChange={event => {
                        const text = event.currentTarget.value
                        setDrafts(current => ({ ...current, [chatId]: text }))
                        setError(null)
                    }}
                    onKeyDown={handleEnter}
                    onInput={autoResize}
                />

                <button
                    className="input-enter"
                    type="button"
                    onClick={handleClick}
                    disabled={!chatId || !value.trim() || isSending}
                    aria-label={isSending ? 'Отправка сообщения' : 'Отправить'}
                >
                    <IconSend />
                </button>
            </div>
            {error?.chatId === chatId && <p role="alert">{error.message}</p>}
        </div>
    )
}

export default MessageInput
