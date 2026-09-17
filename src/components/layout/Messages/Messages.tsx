import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import Message from '@/components/block/Message/Message'
import './Messages.scss'
import MessagesDate from '@/components/block/MessagesDate/MessagesDate'
import getMessageDate from '@/utils/getMessageDate'
import { isNewDay } from '@/utils/date'
import { useSession } from 'next-auth/react'
import { useMergedMessages } from '@/hooks/useMergedMessages'
import { useGetMessagesUser } from '@/hooks/getMessagesUser'
import { useMessageUi } from '@/store/StateManagment'
import { useMessageIdStore } from '@/store/chat-selection.store'
import Skeleton from '@mui/material/Skeleton'


const Messages = () => {
    const selectedUserId = useMessageUi(state => state.selectedChatId)
    const session = useSession()
    const { data: messages = [], isLoading, error, isFetching, isPending, isSuccess, isError } = useGetMessagesUser()
    console.log('текущие сообщения', messages)
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

  setTimeout(() => {
  element?.classList.remove('highlight')
}, 2000)
  }

}, [RefMessageId])


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
            <div className="messages__list"> 
                {isLoading ? (<div>{SkeletonLoaderMessage}</div> )
                :isError ? ( <div>Error {error.message}</div> ) 
                : ( renderMessages.map((msg, index) => { // тут компонент загрузки
  const isUser = msg.senderId === session.data?.user.uid
const currentTime = new Date(msg.createdAt) 
// здесь приводим к Date для рендера

const prevMsg = renderMessages[index - 1];

const prevTime = prevMsg ? new Date(prevMsg.createdAt) : null


const dataData = getMessageDate(currentTime, prevTime)
const showDateDivider = isNewDay(currentTime, prevTime)
// время сообщения для компонента - сообщение   
  const dataRU = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

  return (
    
   
   <div key={msg.id} className='message_container'  
   ref={(el) => {
    messageRefs.current[msg.id] = el
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
        text: msg.text,
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