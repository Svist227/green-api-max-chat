import classNames from 'classnames';
import ChatList from '../../block/ChatList/ChatList'
import SearchBar from '../SearchBar/SearchBar'
import './Sidebar.scss'
import { useChatsOpen } from '@/store/chat-ui.store';
interface ComponentProps {
    fun:boolean,
    children: React.ReactNode;
}
const Sidebar:any = ({children}:ComponentProps) => {
    const isMenuOpen = useChatsOpen(state => state.isOpen)
    return (
        <>
            <div className={classNames('sidebar', {
                'is-close': isMenuOpen
            })}
            
            >
                {children}
                
            </div>
        </>
    )
}

export default Sidebar