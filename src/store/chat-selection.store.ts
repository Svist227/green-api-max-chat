import { create } from 'zustand';
import { MyUser } from '@/types/user';
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





// ДЖЕНЕРИК. (CurrentStore не используется в проекте)
interface ValueStore<T>{
  value: T | null,
  setValue: (param:T) => void
}

// тут просто value объект User
export const useCurrentUser = create<ValueStore<MyUser>>((set) => ({
  value: null,
  setValue: (user) => set({ value:user })

}))


// тут просто строка
export const useMessageIdStore = create<ValueStore<string>>(set => ({
  value: null,
  setValue: (idMessage) => set({value:idMessage})
}))