import type { Chat } from '@/types/chat'
import './ChatSearchResults.scss'
import ChatWindow from '@/components/block/ChatWindow/ChatWindow'
import ZeroState from '@/components/block/ZeroState/ZeroState'



interface UserData {
    data: Chat[]
}

 
const ChatSearchResults = ({data}:UserData) => {
    return (
        <>
        {data.length > 0 ? (
            data.map((user)=> {
            return (
                <ChatWindow key={user.chatId} UserParams={user} />
            )
        })
        ): (
            <ZeroState />
        )}
        </>
    )
}

export default ChatSearchResults

