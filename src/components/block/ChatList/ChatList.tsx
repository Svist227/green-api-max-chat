import ChatWindow from '@/components/block/ChatWindow/ChatWindow'
import './ChatList.scss'
import { useSession } from 'next-auth/react';
import { useGetDataUser } from '@/hooks/getDataUser';
import { useGetDataUserMessage } from '@/hooks/getListMessagesUser';
import Skeleton from '@mui/material/Skeleton';

    const ChatList = () => {
        const session = useSession()
        const CurrentUser = session.data?.user
        const { data: users = [], 
        isLoading: isUsersLoading, 
        error: usersError,
        isPending: isUsersPending
     } = useGetDataUser()

    const { 
    data: mychats = [],
    isPending: isChatsPending, 
    error: chatsError, 
    isFetching: isChatsFetching, 
    isSuccess: isChatsSuccess,
} = useGetDataUserMessage()

        console.log('mychats', mychats)
        console.log('users', users)
        const chatUserIds = new Set(mychats.map(chat => chat.otherUser.uid)) // множ-ство uid с кем есть чатов
        const recommendedUsers = users.filter(user => {
          if (CurrentUser?.uid == user.uid) return // чат с сам собой
          return !chatUserIds.has(user.uid) // если нет среди users то он сюда автоматически попадает
          })

const LoaderChats = <div className='loader' >   
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>
    <Skeleton variant="circular" height={80}/>
    <Skeleton variant="rounded" height={80}/>   
    
</div>             // Сюда поместим компонент Loader-а

            if (usersError){
    return <div>ошибка {usersError.message} </div>  // Сюда поместим компонент Ошибки
}
          
            if (chatsError){
    return <div>ошибка {chatsError.message} </div>  // Сюда поместим компонент Ошибки
}
       
    

        return (

    
            <div className="chat-list" >
                
                <div className='chat-list-name h1'> My Chats</div>
                
                { isChatsPending ? LoaderChats: mychats.map((chat, index) => (
                        <ChatWindow key={index} UserParams = {{
                            id: chat.otherUser.uid,
                            photo: chat.otherUser.photoURL || "",
                            username:chat.otherUser.username || "Без имени",
                            message:chat.lastMessage,
                            data: chat.time,
                            // colMessage:chat.messages.length
                        }
                        }
                        />
                ))}

                {recommendedUsers.length > 0 && (
                            <div className='chat-list-name h1'>Recommended Chats</div>

                )}

                {isUsersPending ? LoaderChats : recommendedUsers.map((user,index2) => (
                    <ChatWindow key={index2} UserParams={{
                        id: user.uid,
                        photo:user.photoURL || '',
                        username:user.username|| "Без имени",
                        message:"",
                        data:""

                    }}/>
                ))}
                <div className='chat-list-name h1'> AI Asistents</div>
        <h4 style={{textAlign:'center', paddingBlock:'30%'}}>Coming soon...</h4>

                </div>
      

        )
    }

    export default ChatList