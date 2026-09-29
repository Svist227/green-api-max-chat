'use client'
import { useMessageIdStore, usesChatStore } from '@/store/chat-selection.store';
import './ChatWindow.scss'
import { useMessageUi } from '@/store/StateManagment';
import { useChatAvatar } from '@/hooks/useChatAvatar';
import { useState } from 'react';



interface ChatWindowProps {
  UserParams: Chat;
  mode?: 'default' | 'search';
}
const ChatWindow = ({UserParams, mode = 'default'}: ChatWindowProps) => {
    const { data: avatar } = useChatAvatar(UserParams.chatId)
    console.log('avatar',avatar)
    const name = UserParams.isSelf ? 'Избранное' : UserParams.name || UserParams.username || 'Без имени'
    const setSelectedUser = usesChatStore(state => state.setSelectedUser)
    const setMessageId = useMessageIdStore(state => state.setValue) 
    const setselectedUserId = useMessageUi(state => state.selectChat)

    const getId = () => {
        if (mode === 'search') {
            setMessageId(UserParams.chatId)
            return;
    }
      // добавление useroв в state/
         setSelectedUser(UserParams)
    
    setselectedUserId(UserParams.chatId)

    
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
