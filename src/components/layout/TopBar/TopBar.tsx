
import './TopBar.scss'

import { useChatMode, useChatsOpen, useFocusStore, useSettingsPanelStore } from '@/store/chat-ui.store';
import { usesChatStore } from '@/store/chat-selection.store';
const   TopBar = () => {
   const MenuOpen = useChatsOpen(state => state.toggle)
    const selectedUser = usesChatStore(state => state.selectedUser)
    const name = selectedUser?.isSelf ? 'Избранное' : selectedUser?.name || selectedUser?.username || 'Без имени'
    // const {status, lastLogin} = useUserStatus()
    // const {print} = useTypingStatus()
    const setOpenSettingsPanel = useSettingsPanelStore(state => state.toggle)
    const setMode = useChatMode(state => state.setMode)
    const {toggle}  = useFocusStore();
    const isOpenMenu = useChatsOpen(state => state.toggle)
  
    

    const handleClickSearch = () => {
        setMode('messages')
        toggle()
        isOpenMenu()

    }





    return (
        <>
        
            <div className="topbar">
            <div className="topbar__info">
                 <img onClick={MenuOpen} className = 'topbar__info-burger'src='burger.svg' alt="button__burger" />
               {selectedUser && (
  <>
   
      <div className="user-avatar">
        {name.charAt(0)}
      </div>
   

    <div className="topbar__info-description">
      <div>{name}</div>
      <p>
        {/* {selectedUser.username !== 'Избранное' && statusText} */}
      </p>
    </div>
  </>
)}
            </div>
            <div className="topbar__icons">
                                <img src="/search.svg" alt="search-message" onClick={handleClickSearch}/>
                <img src="/more.svg" alt="more" onClick={setOpenSettingsPanel}/> 
                
                

            </div>
        </div>
        
        
        </>
    )
}

export default TopBar
