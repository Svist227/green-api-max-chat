import { create } from 'zustand';
import { Message } from '@/types/message';


// Перенос на серверный стейт будет.
interface ChatState {
  selectedChatId: string | null;
  messages: {
    [chatId: string]: Message[];
  };
  selectChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
}

export const useMessageUi = create<ChatState>((set) => ({
  selectedChatId: null,
  messages: {}, // Объект, ключи — chatId
  selectChat: (id: string) =>
    set({ selectedChatId: id }),
  addMessage: (chatId: string, message: Message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),
}));









