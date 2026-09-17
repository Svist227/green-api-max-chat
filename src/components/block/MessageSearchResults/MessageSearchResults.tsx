import './MessageSearchResults.scss'
import { Timestamp } from 'firebase/firestore'
import ChatWindow from '@/components/block/ChatWindow/ChatWindow'
import ZeroState from '@/components/block/ZeroState/ZeroState'
import { useSession } from 'next-auth/react'
import { usesChatStore } from '@/store/chat-selection.store'

interface Message {
    createdAt:Timestamp
    id:string
    senderId:string
    text:string
    
}


interface MessageData {
    data:Message[]
}


const MessageSearchResults = ({data}:MessageData) => {
    const sesion = useSession()
    const currentUser = sesion.data?.user 
    const selectedUser = usesChatStore(state => state.selectedUser)
  
    
    return (
        <>
        {data.length > 0 ? (
            data.map((message, index) => {
            if (!currentUser || !selectedUser) return null;
           
           const isMyMessage = currentUser?.uid === message.senderId;

  const userPhoto = isMyMessage
    ? currentUser?.image
    : selectedUser?.photoURL;

  const userName = isMyMessage
    ? currentUser?.username
    : selectedUser?.username;

    const dataRU = message.createdAt.toDate().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

            return (
                 <ChatWindow key={index}
                UserParams={{
                    id: message.id,
                    photo:  userPhoto || '',
                    username:userName || "Без имени",
                    message: message.text,
                    data: dataRU,

                }}
                mode = {'search'}
                />
            )
        })
        ) : (
            <ZeroState/>
        )}
        </>
    )
}

export default MessageSearchResults