// apiUrl - ссылка на хост API
// mediaUrl - ссылка на хост API для отправки файлов
// idInstance - уникальный номер инстанса
// apiTokenInstance - ключ доступа инстанса
import { parseGreenCookie } from '@/utils/parseTokens';
import type {AuthOptions} from 'next-auth'
import Credentials from 'next-auth/providers/credentials';
const apiUrl = 'https://4100.api.green-api.com'
import { cookies } from 'next/headers'

export const authConfig2: AuthOptions = {
providers: [
    Credentials(
      {  credentials: {
           
        },
        async authorize() {
            const cookieStore = await cookies()
            const value =
             cookieStore.get('green_pending')?.value

            const keys = parseGreenCookie(value)
  if (!keys) {
          return null
        } 
        
        const {
          idInstance,
          apiTokenInstance
        } = keys

            if(!apiTokenInstance || !idInstance) return null

            const url = `${apiUrl}/waInstance${idInstance}/qr/${apiTokenInstance}`

                const res = await fetch(url, {
        method: 'GET',
      })
      
        const result = await res.json();  
        if(result.type === 'already_registered'){
          const accountResponse = await fetch(
            `${apiUrl}/waInstance${encodeURIComponent(idInstance)}/getAccountSettings/${encodeURIComponent(apiTokenInstance)}`,
            { cache: 'no-store' },
          )
          if (!accountResponse.ok) return null

          const account = await accountResponse.json()
          if (typeof account?.chatId !== 'string' || !account.chatId.trim()) return null

            return {
            id: idInstance,
            apiTokenInstance: apiTokenInstance,
            ownChatId: account.chatId,
          }
        }

        return null



        }
         }
    )
],
 callbacks: {

    async jwt({ token, user }) {

      // Выполняется при первом успешном signIn
      if (user) {
        token.idInstance = user.id
        if ('apiTokenInstance' in user) token.apiTokenInstance = user.apiTokenInstance
        if ('ownChatId' in user) token.ownChatId = user.ownChatId
      }

      return token
    },


  },

pages:{
        signIn: '/login' 
    },
}

