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
        console.log('result', result)
        if(result.type === 'already_registered'){
            return {
            id: idInstance,
            apiTokenInstance: apiTokenInstance,
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
        token.apiTokenInstance =
          (user as any).apiTokenInstance
      }

      return token
    },


    // async session({ session, token }) {

    //   // idInstance можно отдать клиенту
    //   if (session.user) {
    //     ;(session.user as any).id =
    //       token.idInstance
    //   }

    //   // apiTokenInstance сюда НЕ кладём

    //   return session
    // },
  },

pages:{
        signIn: '/login' 
    },
}

