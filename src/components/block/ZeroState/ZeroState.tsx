import { useChatMode } from '@/store/chat-ui.store'
import './ZeroState.scss'
import { useValueSearch } from '@/store/chat-selection.store'

const ZeroState = () => {
    const mode = useChatMode(state => state.mode)
    const value = useValueSearch(state => state.currentValue)
   let rusMode = '' 

    if (mode === 'chats') {
        rusMode = 'чатов'
    } else if (mode === 'messages') {
        rusMode = 'сообщений'
    }
    return (
        <div className='ZeroState'>
            { 
                !value
                ?
                <p className='h4'>Режим поиска {rusMode}</p>
                : <p className='h4'> Ничего не найдено</p>
            }
              
        </div>
    )
}

export default ZeroState