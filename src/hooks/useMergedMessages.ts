import { Message, RawMessage } from '@/types/message'
import { mapFirestoreData } from '@/utils/mapFirestoreData'
import { useMemo } from 'react'



export const useMergedMessages = (messages: RawMessage[],messageUi: Message[]): Message[] => {

  // приведение времени сообщений под вывод
  function convertTime(message:RawMessage):Message{
    return {
       ...message,
      createdAt: message.createdAt.toDate().getTime()
    }
    
  }


  const dbMessages = mapFirestoreData(messages, convertTime)



  // Объединение данных с firestore и у моментальных локальных сообщений
  const mergedMessages = useMemo(() => {
    const map = new Map<string, Message>()

    // optimistic
    for (const m of messageUi) {
      map.set(m.id, m)
    }

    // server (override)
    for (const m of dbMessages) {
      map.set(m.id, m)
    }

    return Array.from(map.values()).sort(
      (a, b) => a.createdAt - b.createdAt
    )
  }, [messageUi, dbMessages])

  return mergedMessages
}