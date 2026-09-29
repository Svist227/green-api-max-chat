'use client'
import Chat from '../components/block/Chat/Chat'
import '@/app/App.scss'
import Sidebar from '../components/layout/Sidebar/Sidebar'
import Content from '../components/layout/Content/Content'
import SearchBar from '../components/layout/SearchBar/SearchBar'
import TopBar from '../components/layout/TopBar/TopBar'
import Messages from '../components/layout/Messages/Messages'
import MessageInput from '../components/layout/MessageInput/MessageInput'
import ChatListContainer from '../components/block/ChatListContainer/ChatListContainer'
import SliderTabs from '../components/block/SliderTabs/SliderTabs'
import SettingsPanel from '@/components/layout/SettingsPanel/SettingsPanel'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useMessageUi } from '@/store/StateManagment'
import { useMessageIdStore, useValueSearch } from '@/store/chat-selection.store'
import { useSettingsPanelStore } from '@/store/chat-ui.store'
import { useChatMode } from '@/store/chat-ui.store'
import { usesChatStore } from '@/store/chat-selection.store'
import { QueryClient,QueryClientProvider,} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function AccountChat() {
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,       // глобальная свежесть времени
      gcTime: 20000,          // удаляют данные из кеша, после выхода со страницы происходит 
      retry: 4,        // сколько перезапросов допускается
    }
  }
}))

  const mode = useChatMode(state => state.mode)
  const setMode = useChatMode(state => state.setMode)
  const selectedUser = usesChatStore(state => state.selectedUser)
  let renderSlider = 0
  if (mode !== 'default' && selectedUser){
    renderSlider = 1
  }
  return (
    <QueryClientProvider client={queryClient}>  
           <ReactQueryDevtools initialIsOpen={false} />
     <Content>
          <Sidebar >
            <SearchBar/>
              {renderSlider > 0 && (
                <SliderTabs mode={mode} setMode={setMode} />
)}          

            <ChatListContainer searchMode = {mode}/>
          </Sidebar>
          <Chat>
            <TopBar/>  
            {/* придумал бизнес идею еще Ai ассистент в чатах...  как ответить лучше, поиск сообщений, например паролей и т.д. */}
            <Messages/>
            <MessageInput />
            <SettingsPanel/>
          </Chat>
     </Content>
      </QueryClientProvider>


  )

}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const accountKey = session?.instance ? `${session.instance.messenger}:${session.instance.idInstance}` : null
  const [readyAccount, setReadyAccount] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (status !== 'authenticated' || !accountKey) {
      usesChatStore.setState({ accountKey: null, selectedUser: null })
      useMessageUi.setState({ messages: {} })
      setReadyAccount(null)
      router.replace('/login')
      return
    }
    if (usesChatStore.getState().accountKey !== accountKey) {
      usesChatStore.setState({ accountKey, selectedUser: null })
    }
    useMessageUi.setState({ messages: {} })
    useValueSearch.setState({ currentValue: '' })
    useMessageIdStore.setState({ value: null })
    useChatMode.setState({ mode: 'default' })
    useSettingsPanelStore.setState({ isOpen: false })
    setReadyAccount(accountKey)
  }, [accountKey, status, router])

  if (status !== 'authenticated' || !accountKey || readyAccount !== accountKey) return <p>Загрузка…</p>
  return <AccountChat key={accountKey} />
}