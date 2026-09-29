import type { Chat } from '@/types/chat'
import './ChatListContainer.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ChatList from '../ChatList/ChatList'
import ChatSearchResults from '@/components/block/ChatSearchResults/ChatSearchResults'
import MessageSearchResults from '@/components/block/MessageSearchResults/MessageSearchResults'
import { useGetDataUser } from '@/hooks/getDataUser'
import { useGetMessagesUser } from '@/hooks/getMessagesUser'
import { useMergedMessages } from '@/hooks/useMergedMessages'
import { usesChatStore, useValueSearch } from '@/store/chat-selection.store'
import { useMessageUi } from '@/store/StateManagment'
import { useChatsOpen, type chatMode } from '@/store/chat-ui.store'

function normalizePhone(value: string) {
    if (!/^\+?[\d\s()-]+$/.test(value)) return ''
    let phone = value.replace(/[\s()-]/g, '').replace(/^\+/, '')
    if (!value.startsWith('+') && phone.length === 11 && phone.startsWith('8')) {
        phone = `7${phone.slice(1)}`
    }
    if (!/^[1-9]\d{7,14}$/.test(phone)) return ''
    if (phone.startsWith('7') && phone.length !== 11) return ''
    return phone
}

async function findContact(phoneNumber: string, accountKey: string | null): Promise<Chat | null> {
    const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-instance-key': accountKey || '' },
        body: JSON.stringify({ phoneNumber }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Не удалось найти контакт')
    return data
}

async function getContacts(accountKey: string | null): Promise<Chat[]> {
    const res = await fetch('/api/chats?contacts=true', {
        headers: { 'x-instance-key': accountKey || '' },
        cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Не удалось загрузить контакты MAX')
    return data
}

const ChatListContainer = ({ searchMode }: { searchMode: chatMode }) => {
    const toggleMenu = useChatsOpen(state => state.toggle)
    const value = useValueSearch(state => state.currentValue)
    const chatId = usesChatStore(state => state.selectedUser?.chatId)
    const accountKey = usesChatStore(state => state.accountKey)
    const isMax = accountKey?.startsWith('max:') === true
    const localMessages = useMessageUi(state => chatId ? state.messages[chatId] : undefined) || []
    const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useGetMessagesUser()
    const { data: users = [], isLoading, error } = useGetDataUser()
    const mergedMessages = useMergedMessages(messages, localMessages)

    const query = value.trim()
    const isPhoneSearch = /^\+|^\d[\d\s()-]*$/.test(query)
    const phone = isPhoneSearch ? normalizePhone(query) : ''
    const searchText = query.replace(/^@/, '').toLowerCase()
    const contacts = useQuery({
        queryKey: ['contacts', accountKey],
        queryFn: () => getContacts(accountKey),
        enabled: isMax && searchMode === 'chats' && !!searchText && !isPhoneSearch,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
    const searchUsers = [...users]
    for (const contact of contacts.data || []) {
        const index = searchUsers.findIndex(user => user.chatId === contact.chatId)
        if (index === -1) searchUsers.push(contact)
        else searchUsers[index] = {
            ...searchUsers[index],
            ...contact,
            name: contact.name || searchUsers[index].name,
            username: contact.username || searchUsers[index].username,
            phoneNumber: contact.phoneNumber || searchUsers[index].phoneNumber,
        }
    }
    const matchesUsername = (user: Chat) => !!searchText &&
        !!user.username?.replace(/^@/, '').toLowerCase().includes(searchText)

    const userFilter = isPhoneSearch
        ? searchUsers.filter(user => phone && String(user.phoneNumber) === phone)
        : [
            ...searchUsers.filter(matchesUsername),
            ...searchUsers.filter(user => searchText && !matchesUsername(user) &&
                (user.isSelf ? 'Избранное' : user.name).toLowerCase().includes(searchText)),
        ]

    const [debouncedPhone, setDebouncedPhone] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPhone(phone), 600)
        return () => clearTimeout(timer)
    }, [phone])

    const needsLookup = searchMode === 'chats' && !!phone && userFilter.length === 0
    const contact = useQuery({
        queryKey: ['contact', accountKey, phone],
        queryFn: () => findContact(phone, accountKey),
        enabled: needsLookup && phone === debouncedPhone,
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const messageFilter = query
        ? mergedMessages.filter(message => message.textMessage?.toLowerCase().includes(query.toLowerCase()))
        : []

    let content
    if (searchMode === 'chats') {
        if (isPhoneSearch && !phone) content = <p>Введите полный номер с кодом страны, например +7 (999) 123-45-67</p>
        else if (needsLookup && (phone !== debouncedPhone || contact.isPending)) content = <p>Поиск контакта…</p>
        else if (needsLookup && contact.error) content = <p role="alert">{contact.error.message}</p>
        else if (!isPhoneSearch && !userFilter.length && (isLoading || contacts.isFetching)) content = <p>Поиск контактов…</p>
        else if (!isPhoneSearch && !userFilter.length && (error || contacts.error)) content = <p role="alert">{(error || contacts.error)?.message}</p>
        else content = <ChatSearchResults data={userFilter.length ? userFilter : needsLookup && contact.data ? [contact.data] : []} />
    } else if (searchMode === 'messages') {
        if (!chatId) content = <p>Выберите чат для поиска сообщений</p>
        else if (messagesLoading) content = <p>Загрузка сообщений…</p>
        else if (messagesError && mergedMessages.length === 0) content = <p role="alert">{messagesError.message}</p>
        else content = <MessageSearchResults data={messageFilter} />
    } else {
        content = <ChatList />
    }

    return (
        <div className="chat__container" onClick={event => {
            if (event.target instanceof Element && event.target.closest('.chat-window')) toggleMenu()
        }}>
            {content}
        </div>
    )
}

export default ChatListContainer
