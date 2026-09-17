import { create } from 'zustand';

// Рефакторинг.  // type - messages, chats, default
// task 1 на union
export type chatMode = 'messages' | 'chats' | 'default'

interface ChatListState{
  mode: chatMode,
  setMode: (param:chatMode) => void
}
export const useChatMode = create<ChatListState>((set) => ({
  mode: 'default',
  setMode: (param) => set({mode:param})
}))


//task 2 на базовый тип. фабрика однотипных сторов.

interface ToggleBollean {
  isOpen: boolean,
  toggle: () => void
}

const createToggleStore = function(){
    return create<ToggleBollean>(set => ({
      isOpen:false,
      toggle: () => set(state => ({ isOpen: !state.isOpen
    }))
}))
  }   
  


export const useChatsOpen = createToggleStore()

// Переключалка на окно настроек
export const useSettingsPanelStore = createToggleStore()


export const useFocusStore = createToggleStore()
