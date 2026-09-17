import './ChatListContainer.scss'
import ChatList from '../ChatList/ChatList'
import ChatSearchResults from '@/components/block/ChatSearchResults/ChatSearchResults'
import MessageSearchResults from '@/components/block/MessageSearchResults/MessageSearchResults'
import { useGetDataUser } from '@/hooks/getDataUser'
import { useGetMessagesUser } from '@/hooks/getMessagesUser'
import { useValueSearch } from '@/store/chat-selection.store'
import { useChatsOpen } from '@/store/chat-ui.store'
import Skeleton from '@mui/material/Skeleton';

type Item = {
    searchMode:string
}
const ChatListContainer = ({searchMode}:Item) => {
    const isMenuOpen = useChatsOpen(state => state.toggle)
    const value = useValueSearch(state => state.currentValue)
    const { data: messages = [] } = useGetMessagesUser()
    
    const { data: users = [], isLoading, error, isFetching, isPending, isSuccess } = useGetDataUser()
   
 

        // фильтрация пользователей
        let userFilter = users.filter((user)=> {
            if(!value) return 
            return user.username?.toLowerCase().includes(value.toLowerCase())
        }
        )

    // фильтрация сообщений текущего user-а
         let userMessagegFilter = messages.filter((message) => {
            if(!value) return 
            return  message.text?.toLowerCase().includes(value.toLowerCase())
         })



        //  console.log('Отфильтрованные сообщения', userMessagegFilter)

        
       
    if (searchMode === 'chats'){ // такс 
        return (
            <div className="chat__container" onClick={isMenuOpen}>
            <ChatSearchResults data = {userFilter}   />
             </div>
        )
    }

    if (searchMode === 'messages'){ // такс 
        return (
            <div className="chat__container" onClick={isMenuOpen}>
            <MessageSearchResults data = {userMessagegFilter} />
            </div>
            
        )
    }

    

    
    return(
    <div className="chat__container" onClick={isMenuOpen}>
        

        <ChatList/>
    
    </div>
    )
}


export default ChatListContainer