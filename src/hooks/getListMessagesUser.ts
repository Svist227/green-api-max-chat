import { useSession } from 'next-auth/react'
import { firestore } from '@/lib/firebase'
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
} from 'firebase/firestore'
import { ChatMetaSchema } from '@/schemas/ChatMetaSchema'
import { ChatItem } from '@/schemas/ChatItemSchema'
import { useQuery } from '@tanstack/react-query'


async function getMessagesUser(
  currentUserId: string
): Promise<ChatItem[]> {

  const chatRef = query(
    collection(firestore, 'chats'),
    where('members', 'array-contains', currentUserId)
  )

  const chatItems: ChatItem[] = []

  const snapshot = await getDocs(chatRef)

  snapshot.forEach((doc) => {

    try {
      console.log('data внутри чатов', doc.data())
      const data = ChatMetaSchema.parse(doc.data())

      const otherUserId = data.members.find(
        id => id !== currentUserId
      )

      if (!otherUserId) {
        return
      }

      const time = data.updatedAt.toDate()
          

      const timeRU = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

      const dataChat: ChatItem = {
        chatId: doc.id,

        otherUser: {
          uid: otherUserId,
          username: data.membersInfo[otherUserId].username,
          photoURL: data.membersInfo[otherUserId].photoURL,
        },

        lastMessage: data.lastMessage,
        time: timeRU,
      }
      console.log('dataChat', dataChat)
      chatItems.push(dataChat)

    } catch (error) {

      console.error(
        `Битый документик ${doc.id}`,
        error
      )

    }

  })

  return chatItems
}


export const useGetDataUserMessage = () => {

  const { data: session } = useSession()

  const currentUserId = session?.user?.uid

  const query = useQuery({
    queryKey: ['mychats', currentUserId],

    queryFn: () => getMessagesUser(currentUserId!),

    enabled: !!currentUserId,
  })

  return query
}