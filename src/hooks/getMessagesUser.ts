import { useEffect, useState } from "react"
import { getChatId } from "../utils/getChatId"
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestore} from '@/lib/firebase'
import { useSession } from "next-auth/react"
import { RawMessage } from "@/types/message"
import { RawMessageSchema } from "@/schemas/MessageSchema"
import { usesChatStore } from "@/store/chat-selection.store"
import { QueryClient, useQuery } from "@tanstack/react-query"

async function getMessagesHistoryUser( currentUserId: string,selectedUserId: string, signal:AbortSignal): Promise<RawMessage[]>{
  


    const chatId = getChatId(currentUserId, String(selectedUserId))
    
    const q = query(
      collection(firestore, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    )

        const snapshot = await getDocs(q)
        const resultMessage: RawMessage[] = [];

        snapshot.docs.forEach(doc => {
        try{
              const message = RawMessageSchema.parse({id: doc.id, ...doc.data() })
              resultMessage.push(message)
          }

        catch(e){
        console.warn('Сообщения пользвателя неккоректны', e)
      }
         
        })
         

      return resultMessage
     
    
  

}

// получение истории сообщений.
export const useGetMessagesUser = () => {
   const selectedUser = usesChatStore(state => state.selectedUser) 
    const session = useSession()
    const CurrentUser = session.data?.user
    


// можно настроить чтобы в зависимости от мода эффект возвращаал список всех сообщений или текущего user-а

  const query = useQuery({
      queryKey:[
        'messages',
        CurrentUser?.uid,
        selectedUser?.uid
      ],
      queryFn: ({signal}) => getMessagesHistoryUser( CurrentUser!.uid,
        selectedUser!.uid, 
      signal),
        enabled: !!CurrentUser && !!selectedUser,
        

    })

    console.log(query.data)
    
 

        return query
    


}


