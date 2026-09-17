'use client'
import { useMessageIdStore, usesChatStore } from '@/store/chat-selection.store';
import './ChatWindow.scss'
import { useMessageUi } from '@/store/StateManagment';



interface ChatWindowProps {
  UserParams: Chat;
  mode?: 'default' | 'search';
}
const ChatWindow = ({UserParams, mode = 'default'}: ChatWindowProps) => {
    const setSelectedUser = usesChatStore(state => state.setSelectedUser)
    const setMessageId = useMessageIdStore(state => state.setValue) 
    const setselectedUserId = useMessageUi(state => state.selectChat)

    const getId = () => {
        if (mode === 'search') {
            setMessageId(UserParams.id)
            return;
    }
      // добавление useroв в state/
         setSelectedUser({
      uid: UserParams.id,
      email: '',
      username: UserParams.username,
      photoURL: UserParams.photo,
    })
    
    setselectedUserId(UserParams.id)

    
    }
    
    return (
       <div onClick={getId} className="chat-window">
           <div className="chat-window__photo-container" >
        {UserParams.photo ? (<img src={UserParams.photo}   referrerPolicy="no-referrer"
 className = 'chat-window__photo'alt="photo" />
) : <div className="user-avatar">{UserParams?.username?.charAt(0)}</div>}

            
            </div>
            <div className="chat-window__description">
                <div className="chat-window__description-top">
                    <div className="chat-window__description-top-name">
                      <h4 className='h1'>{UserParams.username}</h4>
                    </div>
                    {UserParams.data && (
                        <div className="chat-window__description-top-time">
                        <p>{UserParams.data}</p>
                    </div>
                    )}
                </div>
                <div className="chat-window__description-down">
                    <div className="chat-window__description-down-message">
                        <p >{UserParams.message}</p>
                    </div>
                    {/* {UserParams.colMessage > 0 && (
                        <div className="chat-window__description-down-col-message">
                        {UserParams.colMessage}
                    </div>
                    )} */}
                </div>
            </div>
          
       </div>

                )
}

export default ChatWindow