import ChatWindow from '@/components/block/ChatWindow/ChatWindow'
import './ChatList.scss'
import { useGetDataUser } from '@/hooks/getDataUser';
import Skeleton from '@mui/material/Skeleton';

    const ChatList = () => {
        const { data: users = [], 
        error: usersError,
        isPending: isUsersPending
     } = useGetDataUser()




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
          
    

        return (

    
            <div className="chat-list" >
                
                <div className='chat-list-name h1'> My Chats</div>
                
                { isUsersPending ? LoaderChats: users.map((chat) => (
                        <ChatWindow key={chat.chatId} UserParams={chat} />
                ))}

               

                <div className='chat-list-name h1'> AI Asistents</div>
        <h4 style={{textAlign:'center', paddingBlock:'30%'}}>Coming soon...</h4>

                </div>
      

        )
    }

    export default ChatList
