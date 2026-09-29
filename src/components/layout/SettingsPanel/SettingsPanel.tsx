import { useState } from "react";

import './SettingsPanel.scss'
import {IconNotif,IconTheme,IconStorage,IconPrivacy,IconBlock,IconReport,IconLogout,IconChevron,IconClose} from './icons'
import { messengers } from "@/constants/url";
import { signOut, useSession } from "next-auth/react";
import { useSettingsPanelStore } from "@/store/chat-ui.store";
import { usesChatStore } from "@/store/chat-selection.store";

export default function SettingsPanel() {
  const { data: session } = useSession()
  const open = useSettingsPanelStore(state => state.isOpen)
  const setOpen = useSettingsPanelStore(state => state.toggle)
  const [notif, setNotif] = useState(true);
  const [theme, setTheme] = useState(false);
  const selectedUser = usesChatStore(state => state.selectedUser)
  
  const handleClick = async () => {
        

        try{
          const res = await fetch('/api/logout', { headers: { 'x-instance-key': usesChatStore.getState().accountKey || '' } })

          const status = await res.json()

          if(status.message === 'ok'){
            signOut({callbackUrl:"/login"})
             console.log('выход')

          }
          else{
            console.log('Возникла ошибка. Попробуйте еще раз')
          }
        }
        catch(error){
          console.error(error)
        }
       
        
    }
  
  return (
    <>

    
        {/* OVERLAY */}
        <div
          className={`overlay${open ? " show" : ""}`}
          onClick={() => setOpen()}
        />

        {/* PANEL */}
        <div className={`panel${open ? " open" : ""}`}>

          <div className="panel-header">
            <span className="panel-title">Настройки</span>
            <button className="close-btn" onClick={() => setOpen()}>
              <IconClose />
            </button>
          </div>

          {/* USER */}
          <div className="user-block">
            <div className="user-avatar">{selectedUser?.username?.charAt(0)}</div>
            <div className="user-info">
              <div className="user-name">{selectedUser?.username}</div>
              <div className="user-handle">{selectedUser?.username}</div>
            </div>
            
          </div>

          <div className="panel-body">

            {/* PREFERENCES */}
            <div className="section">
              <div className="section-label">Приложение</div>

              <div className="menu-item">
                <div className="item-icon blue"><IconNotif /></div>
                <div className="item-text">
                  <div className="item-label">Уведомления</div>
                  <div className="item-desc">Пуши и звуки</div>
                </div>
                <button
                  className={`toggle${notif ? " on" : ""}`}
                  onClick={() => setNotif(v => !v)}
                />
              </div>

              <div className="menu-item">
                <div className="item-icon"><IconTheme /></div>
                <div className="item-text">
                  <div className="item-label">Тёмная тема</div>
                  <div className="item-desc">Следует за системой</div>
                </div>
                <button
                  className={`toggle${theme ? " on" : ""}`}
                  onClick={() => setTheme(v => !v)}
                />
              </div>

              <div className="menu-item">
                <div className="item-icon"><IconStorage /></div>
                <div className="item-text">
                  <div className="item-label">Хранилище</div>
                  <div className="item-desc">Кэш и медиа</div>
                </div>
                <div className="item-right">
                  <span>128 МБ</span>
                  <IconChevron />
                </div>
              </div>

              <div className="menu-item">
                <div className="item-icon"><IconPrivacy /></div>
                <div className="item-text">
                  <div className="item-label">Конфиденциальность</div>
                </div>
                <div className="item-right"><IconChevron /></div>
              </div>
            </div>

            {/* CHAT ACTIONS */}
            {selectedUser?.username !== 'Избранное' && (
              <div className="section">
              <div className="section-label">Этот чат</div>

              <div className="menu-item">
                <div className="item-icon red"><IconBlock /></div>
                <div className="item-text">
                  <div className="item-label">Заблокировать</div>
                  <div className="item-desc">{selectedUser?.username} больше не сможет писать</div>
                </div>
              </div>

              <div className="menu-item">
                <div className="item-icon red"><IconReport /></div>
                <div className="item-text">
                  <div className="item-label">Пожаловаться</div>
                </div>
              </div>
            </div>
            )}

            {/* ACCOUNT */}
            <div className="section">
              <div className="section-label">{session?.instance ? messengers[session.instance.messenger].label : 'Аккаунт'}</div>
              <button type="button" className="menu-item" onClick={() => signOut({ callbackUrl: '/login' })}>
                <div className="item-icon"><IconLogout /></div>
                <span className="item-text">Сменить инстанс / Выйти</span>
              </button>

              <div className="menu-item">
                <div className="item-icon red"><IconLogout /></div>
                <div className="item-text">
                  <div className="item-label danger" onClick={handleClick}>Отвязать устройство</div>
                </div>
              </div>
            </div>

            <div className="version-row">
              <span className="version-text">Версия 2.4.1</span>
              <span className="version-text">© 2026</span>
            </div>

          </div>
        </div>

    </>
  );
}
