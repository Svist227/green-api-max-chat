import type { Chat } from '@/types/chat'
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface ChatStates {
  selectedUser: Chat | null
  setSelectedUser: (user: Chat) => void
}

// Чат выбранный пользователем.
export const usesChatStore = create<ChatStates>()(
  persist<ChatStates>(
    (set) => ({
      selectedUser: null,
      setSelectedUser: (user) => set({ selectedUser: user }),
    }),
    {
      name: 'chat-storage',
    }
  )
)


// Поиск в строке SearchBar
interface  ValueSearch {
  currentValue: string, 
  setValue:(value:string) => void
}

export const useValueSearch = create<ValueSearch>((set) => ({
  currentValue: "",
  setValue:(value) => set({ currentValue:value })
}))





// Значение выбранного сообщения
interface ValueStore<T>{
  value: T | null,
  setValue: (param:T) => void
}

// ID сообщения для перехода из поиска
export const useMessageIdStore = create<ValueStore<string>>(set => ({
  value: null,
  setValue: (idMessage) => set({value:idMessage})
}))