import './MessageSearchResults.scss'
import '@/components/block/ChatWindow/ChatWindow.scss'
import ZeroState from '@/components/block/ZeroState/ZeroState'
import { useMessageIdStore, usesChatStore } from '@/store/chat-selection.store'
import type { RawMessage } from '@/types/message'

const MessageSearchResults = ({ data }: { data: RawMessage[] }) => {
    const selectedUser = usesChatStore(state => state.selectedUser)
    const setMessageId = useMessageIdStore(state => state.setValue)

    if (!selectedUser || data.length === 0) return <ZeroState />

    return <>
        {data.map(message => {
            const name = selectedUser.isSelf ? 'Избранное' : message.type === 'outgoing'
                ? 'Вы' : message.senderName || selectedUser.name || selectedUser.username || 'Без имени'
            const timestamp = message.timestamp < 1_000_000_000_000 ? message.timestamp * 1000 : message.timestamp
            const date = new Date(timestamp)

            return (
                <button
                    key={`${message.chatId}:${message.idMessage}`}
                    type="button"
                    className="chat-window"
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => setMessageId(message.idMessage)}
                >
                    <div className="chat-window__photo-container">
                        <div className="user-avatar">{name.charAt(0)}</div>
                    </div>
                    <div className="chat-window__description">
                        <div className="chat-window__description-top">
                            <div className="chat-window__description-top-name">{name}</div>
                            <time className="chat-window__description-top-time" dateTime={date.toISOString()}>
                                {date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </time>
                        </div>
                        <div className="chat-window__description-down-message">{message.textMessage}</div>
                    </div>
                </button>
            )
        })}
    </>
}

export default MessageSearchResults
