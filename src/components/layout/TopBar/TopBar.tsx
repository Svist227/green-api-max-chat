
import './TopBar.scss'
import formatRelativeDate from '@/utils/formatDate';
import { useUserStatus } from '@/hooks/useUserStatus';
import { useTypingStatus } from '@/hooks/useTypingStatus';
import { useChatMode, useChatsOpen, useFocusStore, useSettingsPanelStore } from '@/store/chat-ui.store';
import { usesChatStore } from '@/store/chat-selection.store';
const   TopBar = () => {
   const MenuOpen = useChatsOpen(state => state.toggle)
    const selectedUser = usesChatStore(state => state.selectedUser)
    const {status, lastLogin} = useUserStatus()
    const {print} = useTypingStatus()
    const setOpenSettingsPanel = useSettingsPanelStore(state => state.toggle)
    const setMode = useChatMode(state => state.setMode)
    const {toggle}  = useFocusStore();
    const isOpenMenu = useChatsOpen(state => state.toggle)
  
    

    const handleClickSearch = (e:any) => {
        setMode('messages')
        toggle()
        isOpenMenu()

    }


    const statusText = Boolean(print)
  ? 'печатает...'
  : status === 'online'
    ? 'online'
    : lastLogin
      ? formatRelativeDate(lastLogin)
      : 'offline';



    return (
        <>
        {selectedUser && (
            <div className="topbar">
            <div className="topbar__info">
                 <img onClick={MenuOpen} className = 'topbar__info-burger'src='burger.svg' alt="button__burger" />
                {selectedUser.photoURL ? (
                    <img src={selectedUser?.photoURL}
                className='topbar__info-photo' alt="photo" />
                )
                :<div className="user-avatar">{selectedUser?.username?.charAt(0)}</div>

            }
                <div className="topbar__info-description">
                    <div>{selectedUser?.username}</div> 
                    <p>{selectedUser.username !=='Избранное' && (statusText)}</p>
                </div>
            </div>
            <div className="topbar__icons">
                                <img src="/search.svg" alt="search-message" onClick={handleClickSearch}/>
                <img src="/more.svg" alt="more" onClick={setOpenSettingsPanel}/> 
                
                

            </div>
        </div>
        )}
        </>
    )
}

export default TopBar