import type { RawMessage } from '@/types/message'
import { useMemo } from 'react'

export const mergeMessages = (
  messages: RawMessage[],
  messageUi: RawMessage[]
): RawMessage[] => {

    const map = new Map<string, RawMessage>()

    // Серверная версия заменяет локальную с тем же идентификатором.
    for (const message of [...messageUi, ...messages]) {
      if (!message.idMessage || !message.textMessage?.trim()) continue

      // GREEN API передаёт секунды, локальные сообщения могут содержать миллисекунды.
      const timestamp = message.timestamp < 1_000_000_000_000
        ? message.timestamp * 1000
        : message.timestamp

      if (!Number.isFinite(timestamp) || timestamp <= 0 || Number.isNaN(new Date(timestamp).getTime())) continue

      map.set(`${message.chatId}:${message.idMessage}`, { ...message, timestamp })
    }

    return Array.from(map.values()).sort(
      (a, b) => a.timestamp - b.timestamp || a.idMessage.localeCompare(b.idMessage, undefined, { numeric: true })
    )
}

export const useMergedMessages = (messages: RawMessage[], messageUi: RawMessage[]): RawMessage[] =>
  useMemo(() => mergeMessages(messages, messageUi), [messages, messageUi])
