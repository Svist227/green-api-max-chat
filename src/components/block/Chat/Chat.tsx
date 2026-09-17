import { useChatsOpen } from '@/store/chat-ui.store';
import './Chat.scss'
import classNames from 'classnames';
interface ComponentProps {
    children:React.ReactNode
}
const Chat = ({children}:ComponentProps) => {
    const isMenuOpen = useChatsOpen(state => state.isOpen)

    return (
        <>
       <div className = {classNames('chat', {
           'is-close': !isMenuOpen
       })}>
       {children}
       </div>
        </>
    )
}

export default Chat