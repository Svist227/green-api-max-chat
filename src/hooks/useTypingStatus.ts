import { useEffect, useState } from 'react';
import {set, onValue, ref, getDatabase} from 'firebase/database'
import { getChatId } from '@/utils/getChatId';
import { useSession } from "next-auth/react";
import { setTyping } from "@/services/realtime_db";
import { usesChatStore } from '@/store/chat-selection.store';

export const useTypingStatus = () => {
    let selectedUser = usesChatStore(state => state.selectedUser)
    const [print, setPrint] = useState<number | null>(null)
    const session = useSession()
    const currentUser = session.data?.user

    // Чтение
    useEffect(()=>{
        if (!currentUser) return
        if (!selectedUser?.uid) return
        const chatId = getChatId(currentUser.uid, String(selectedUser.uid)) // общий id
        const database = getDatabase();
        const typingref = ref(database, `typing/${chatId}/${selectedUser.uid}`)
    
         // чтение данных
        const unsub = onValue(typingref, (snapshot) => {
            const data = snapshot.val()
             setPrint(data?.prints ?? null)
        })
    
        return () => unsub()
    }, [selectedUser])

    // Запись
    useEffect(()=>{
            if (!currentUser) return
            if (!selectedUser?.uid) return
            const chatId = getChatId(currentUser.uid, String(selectedUser.uid)) // общий id
            setTyping(chatId, currentUser.uid)
    
    
    },[selectedUser,currentUser])


    
        

    return {print}
}