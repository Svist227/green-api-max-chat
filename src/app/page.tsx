'use client'
import Chat from '../components/block/Chat/Chat'
import '@/app/App.scss'
import Sidebar from '../components/layout/Sidebar/Sidebar'
import Content from '../components/layout/Content/Content'
import SearchBar from '../components/layout/SearchBar/SearchBar'
import TopBar from '../components/layout/TopBar/TopBar'
import Messages from '../components/layout/Messages/Messages'
import { ChatProvider } from '../store/ChatContext';
import MessageInput from '../components/layout/MessageInput/MessageInput'
import ChatListContainer from '../components/block/ChatListContainer/ChatListContainer'
import SliderTabs from '../components/block/SliderTabs/SliderTabs'
import SettingsPanel from '@/components/layout/SettingsPanel/SettingsPanel'
import { useChatMode } from '@/store/chat-ui.store'
import { usesChatStore } from '@/store/chat-selection.store'
import { QueryClient,QueryClientProvider,} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,       // глобальная свежесть времени
      gcTime: 20000,          // удаляют данные из кеша, после выхода со страницы происходит 
      retry: 4,        // сколько перезапросов допускается
    }
  }
})

//перезапрос данных ко ключу если данные старые т.е. статус stale
const invalidateMessage = () => {
  queryClient.invalidateQueries({queryKey: ['mychats']})
}

const cancelRequest = () => {
  queryClient.cancelQueries({queryKey: ['mychats']})
}

function Home() {   
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
    <ChatProvider>
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
    </ChatProvider>
      </QueryClientProvider>

   
  )
 
}

export default Home