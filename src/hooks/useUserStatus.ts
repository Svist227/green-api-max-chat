
import realtime from '@/services/realtime_db';
import { usesChatStore } from '@/store/chat-selection.store';
import {set, onValue, ref, getDatabase} from 'firebase/database'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';


// Хук для получения и чтения статуса онлайн выбранного пользователя 
export const  useUserStatus = () => {
let selectedUser = usesChatStore(state => state.selectedUser) // мб в пропс засунуть
const [status, setStatus] = useState<string>()
const [lastLogin, setLastLogin] = useState<number | null>(null)
const session = useSession()
    const currentUser = session.data?.user
  // Realtime database запись текущего пользователя
    useEffect(() => {
    if (!currentUser) return
    realtime(currentUser.uid)
}, [currentUser])
    
     // Realtime database чтение выбранного пользователя онлайн ли?
    useEffect(() => {
        if(!selectedUser) return
        const database = getDatabase();
        const statusref = ref(database, 'status/' + selectedUser?.uid )
    
        // чтение данных
        const unsub = onValue(statusref, (snapshot) => {
            const data = snapshot.val()
            setStatus(data?.state ?? null)
            setLastLogin(data?.lastLogin ?? null)
        })
        
        return () => unsub()
        
    }, [selectedUser])

    return { status, lastLogin }
}