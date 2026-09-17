import './MessageInput.scss'
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useMessageUi,  } from '@/store/StateManagment';
import { getChatId } from '@/utils/getChatId'
import { useSession } from 'next-auth/react';
import { getDatabase, ref,update } from "firebase/database";
import { SendMessages } from '@/services/sendMessages';
import { IconAttach, IconEmoji, IconSend } from './icons';
import { usesChatStore } from '@/store/chat-selection.store';

const MessageInput = () => {
    const [value, setValue] = useState(""); // храниие соообщения из onChange
    const session = useSession()
    const database = getDatabase();
    const addMessageUi = useMessageUi(state => state.addMessage)
    const [emojiOpen, setEmojiOpen] = useState(false)
  // const fileInputRef = useRef(null);

    // данные тек-его выбранного user-а с кем переписка
    const selectedUser = usesChatStore(state => state.selectedUser)

    const handleClick = async () => {
        const tempId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;

        if (!value.trim()) return
        setValue('')
        
        const currentUser = session.data?.user
        if (!currentUser || !selectedUser) return

        // UI 
        addMessageUi(selectedUser.uid,{
          id: tempId, 
          text:value,
          senderId:currentUser.uid,
          createdAt: Date.now()
        })

        

        // асинхронная отправка на сервер
        SendMessages({
          id: tempId, 
          value,
          currentUser,
          selectedUser
        })

        
       
  }

  const handleEnter = (e:React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleClick()
  }
  }
    

  const autoResize = (event:React.FormEvent<HTMLTextAreaElement>) => {
    const e = event.currentTarget
    e.style.height = 'auto';
    e.style.height = (e.scrollHeight-6) + 'px';

     const currentUser = session.data?.user
        if (!currentUser || !selectedUser) return

        const chatId = getChatId(currentUser.uid, String(selectedUser.uid)) // общий id

 // статус печатает
    update(ref(database, `typing/${chatId}/${session.data?.user.uid}`) ,   {
      prints: 1
    })

  }

  const handleChangeInput = (event:React.FormEvent<HTMLTextAreaElement>) => {
    const e = event.currentTarget
    setValue(e.value) 
    

    // update данных при change и спустя секунду если не пишет, то меняем state

  }

  const handleEmojiSelect = (emoji: string) => {
  setValue(prev => prev + emoji)
}

const hanldeImaheSelect = () => {

}

// отмена статуса печатает
  useEffect(()=> {
  const timeId = setTimeout(()=>{
     const currentUser = session.data?.user
      if (!currentUser || !selectedUser) return

        const chatId = getChatId(currentUser.uid, String(selectedUser.uid)) // общий id

    update(ref(database, `typing/${chatId}/${session.data?.user.uid}`) ,   {
      prints:0
    })
  }, 4000)
  

  return () => clearTimeout(timeId)


  }, [value])





    return (
              <div className="input">
            <div className="input-wrap">
 
                <div className="input-actions-left">
                    <button className="input-icon-btn" type="button" aria-label="Прикрепить файл"
                    onClick={hanldeImaheSelect} >
                        <input type="file" 
                             accept="image/*"          // только картинки
                            multiple     
                           style={{ display: "none" }}
                            id="file-input" />
                        <IconAttach />
                    </button>
                    <button className="input-icon-btn" type="button" aria-label="Эмодзи">
                        <IconEmoji />
                    </button>
                </div>
 
                <textarea
                    className="input-inner"
                    placeholder="Написать сообщение..."
                    rows={1}
                    value={value}
                    onChange={handleChangeInput}
                    onKeyDown={handleEnter}
                    onInput={autoResize}
                />
 
                <button
                    className="input-enter"
                    type="button"
                    onClick={handleClick}
                    disabled={!value.trim()}
                    aria-label="Отправить"
                >
                    <IconSend />
                </button>
 
            </div>
        </div>

    )
}

export default MessageInput