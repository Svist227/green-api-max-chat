import classNames from 'classnames';
import './Sidebar.scss'
import { useChatsOpen } from '@/store/chat-ui.store';
interface ComponentProps {
    children: React.ReactNode;
}
const Sidebar = ({children}:ComponentProps) => {
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