import { useRef, useEffect } from 'react'
import Message from '@/components/block/Message/Message'
import './Messages.scss'
import MessagesDate from '@/components/block/MessagesDate/MessagesDate'
import { isNewDay } from '@/utils/date'
import { useMergedMessages } from '@/hooks/useMergedMessages'
import { useGetMessagesUser } from '@/hooks/getMessagesUser'
import { useMessageUi } from '@/store/StateManagment'
import { useMessageIdStore, usesChatStore } from '@/store/chat-selection.store'
import Skeleton from '@mui/material/Skeleton'
import { useNotifications } from '@/hooks/useNotifications'


const Messages = () => {
    const { error: notificationError } = useNotifications()
    const selectedUser = usesChatStore(state => state.selectedUser)
    const selectedUserId = selectedUser?.chatId
    const { data: messages = [], isLoading, error, isError } = useGetMessagesUser()
     // соединение Ui и сообщений с бд. в единый поток.
  const messageUi = useMessageUi(state =>
  selectedUserId ? state.messages[selectedUserId] : undefined
) ?? []  


    const renderMessages = useMergedMessages(messages,messageUi)
    const RefMessageId = useMessageIdStore(state => state.value) 
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})

   

// вернуться 
// const BottomRef = useRef<HTMLDivElement>(null);
//     const scrollToBottom = () => {
//             BottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//         }

//     // автопролистование до нижнего сообщения
// useLayoutEffect(() => {
//   scrollToBottom()
// }, [renderMessages.length])




// логика нахождения сообщения в переписке
  useEffect(() => {
  if (!RefMessageId) return

  const element = messageRefs.current[RefMessageId]

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })

    element?.classList.add('highlight')

  const timeoutId = setTimeout(() => {
  element?.classList.remove('highlight')
}, 2000)

  return () => {
    clearTimeout(timeoutId)
    element.classList.remove('highlight')
  }
  }

}, [RefMessageId, renderMessages])


const SkeletonLoaderMessage = <div className='message_content' style={{gap:'10px'}}>
  <Skeleton className = 'message is-me' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message is-me' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message is-me' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message is-me' variant='rounded' width={700} height={60}/> 
  <Skeleton className = 'message' variant='rounded' width={700} height={60}/> 



</div>




return (
        <>
        <div className="messages" >
            {notificationError && <p role="alert">{notificationError}</p>}
            <div className="messages__list"> 
                {!selectedUserId ? <div>Выберите чат</div>
                :isLoading ? (<div>{SkeletonLoaderMessage}</div> )
                :isError && renderMessages.length === 0 ? ( <div>Ошибка: {error.message}</div> )
                :renderMessages.length === 0 ? <div>Текстовых сообщений нет</div>
                : ( renderMessages.map((msg, index) => { // тут компонент загрузки
  const isUser = selectedUser?.isSelf || msg.type === 'outgoing'
const currentTime = new Date(msg.timestamp) 
// здесь приводим к Date для рендера

const prevMsg = renderMessages[index - 1];

const prevTime = prevMsg ? new Date(prevMsg.timestamp) : null


const dataData = currentTime.toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const showDateDivider = isNewDay(currentTime, prevTime)
// время сообщения для компонента - сообщение   
  const dataRU = currentTime.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })

  return (
    
   
   <div key={`${msg.chatId}:${msg.idMessage}`} className='message_container'
   ref={(el) => {
    messageRefs.current[msg.idMessage] = el
  }}
   >
   
   {showDateDivider && (    
    <div className = 'messages__list-dates'>
          <MessagesDate  date = {dataData} />
    </div>
   )}
    <div className="message_content">
    <Message
      data={{
        text: msg.textMessage,
        isUser,
        dataRU,
      }}
    />
  </div>
    </div>
  
  )
}))}
            <div  />
             {/* // для автоскролла к последнему сообщению */}
          </div>
      </div>
    </>
    )
}

export default Messages
