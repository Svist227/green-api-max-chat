'use client'
import type { Chat } from '@/types/chat'
import { usesChatStore } from '@/store/chat-selection.store';
import './ChatWindow.scss'



interface ChatWindowProps {
  UserParams: Chat;
}
const ChatWindow = ({UserParams}: ChatWindowProps) => {
    const name = UserParams.isSelf ? 'Избранное' : UserParams.name || UserParams.username || 'Без имени'
    const setSelectedUser = usesChatStore(state => state.setSelectedUser)

    const getId = () => {
      // добавление useroв в state/
         setSelectedUser(UserParams)
    

    
    }
    
    return (
       <div onClick={getId} className="chat-window">
           <div className="chat-window__photo-container">
              
                  
                   <div className="user-avatar">{name.charAt(0)}</div>
           </div>
            <div className="chat-window__description">
                <div className="chat-window__description-top">
                    <div className="chat-window__description-top-name">
                      <h4 className='h1'>{name}</h4>
                    </div>
                    {/* {UserParams.data && (
                        <div className="chat-window__description-top-time">
                        <p>{UserParams.data}</p>
                    </div>
                    )} */}
                </div>
                <div className="chat-window__description-down">
                    {/* <div className="chat-window__description-down-message">
                        <p >{UserParams.message}</p>
                    </div> */}
                    
                </div>
            </div>
          
       </div>

                )
}

export default ChatWindow
