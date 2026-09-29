import { create } from 'zustand'
import { z } from 'zod'
import { RawMessageSchema } from '@/schemas/MessageSchema'

export const UiMessageSchema = RawMessageSchema.extend({
  type: z.literal('outgoing'),
  typeMessage: z.literal('textMessage'),
  chatId: z.string().min(1),
  idMessage: z.string().min(1),
  timestamp: z.number().positive(),
  textMessage: z.string().refine(text => text.trim().length > 0, 'Введите текст сообщения'),
})

export type UiMessage = z.infer<typeof UiMessageSchema>

interface ChatState {
  messages: Record<string, UiMessage[]>
  addMessage: (message: UiMessage) => void
  confirmMessage: (chatId: string, tempId: string, idMessage: string) => void
  removeMessage: (chatId: string, idMessage: string) => void
}

export const useMessageUi = create<ChatState>((set) => ({
  messages: {},

  addMessage: (message) => {
    const parsed = UiMessageSchema.parse(message)

    set((state) => ({
      messages: {
        ...state.messages,
        [parsed.chatId]: [
          ...(state.messages[parsed.chatId] || []).filter(item => item.idMessage !== parsed.idMessage),
          parsed,
        ],
      },
    }))
  },

  confirmMessage: (chatId, tempId, idMessage) => {
    const confirmedId = z.string().min(1).parse(idMessage)

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(message =>
          message.idMessage === tempId ? { ...message, idMessage: confirmedId } : message
        ),
      },
    }))
  },

  removeMessage: (chatId, idMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).filter(message => message.idMessage !== idMessage),
      },
    })),
}))
