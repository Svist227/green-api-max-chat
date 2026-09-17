import type {AuthOptions} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getChatId } from '@/utils/getChatId'
import Credentials from 'next-auth/providers/credentials';
import { collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';



export const authConfig: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,  //string и ! одно и тоже
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
             httpOptions: {
        timeout: 20000, // 20 секунд
      },
        }),
        Credentials({
          credentials: {
            email: {label: 'email', type: 'email', required:true},
            password: {label: 'password', type: 'password', required:true},

             
          },
          async authorize(credentials){
             if (!credentials?.email || !credentials.password)  return null

            // напрямую делаем запрос.  Идея смотреть есть ли поле пароля, если нет добавляем
             const usersCollectionRef = collection(firestore, 'users');
            const q = query(
          usersCollectionRef,
          where("email", "==", credentials.email)
)
            const snapshot = await getDocs(q)
            if (snapshot.empty) return null
            const userDoc = snapshot.docs[0]
            const currentUser = userDoc.data()
  
            if(currentUser && !currentUser.password){ // пока без пароля авторизацию) если пароля в бд нет
            throw new Error("USE_GOOGLE_LOGIN")

          }
            else if(currentUser && currentUser.password === credentials.password){
               return {
                id: userDoc.id,
                name: currentUser.username,
                email: currentUser.email,
                image: currentUser.photoURL, // вернули user с полями без пароля соо
  }
            } 
            
            return null 
          }
        })
    ],
    
    pages:{
        signIn: '/login' 
    },
    callbacks: {

async jwt({ token, user }) {
  // 🔥 только при логине
  if (user) {
    token.uid = user.id
  }
  console.log("user", user)

  // дальше используем uid
  if (token.uid) {
    const { doc, getDoc } = await import("firebase/firestore")
    const { firestore } = await import("@/lib/firebase")

    const userRef = doc(firestore, "users", token.uid as string)
    const snap = await getDoc(userRef)

    if (snap.exists()) {
      console.log("snap.data().username", snap.data().username)
      token.username = snap.data().username // записали в токен юзернейм
    }
  }

  return token
},

  async session({ session, token }) {
    console.log("token в session", session.user)
    console.log("token в session", token)
    if (session.user) {
      session.user.uid = token.uid as string;
      session.user.username = token.username as string

    }
    return session;
  },

    async signIn({ user }) {
    const { doc, getDoc, setDoc } = await import("firebase/firestore")
    const { firestore } = await import("@/lib/firebase") 
    const userRef = doc(firestore, "users", user.id)
    const snap = await getDoc(userRef)

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.id,
        username: null,
        email: user.email ?? null,
        photoURL: user.image ?? null,
        lastLogin: new Date(),
      })

      console.log("Создан новый пользователь")
    } else {
      console.log("Пользователь уже существует")
    }

    console.log('Создание избранного')
        const chatId = getChatId(user.id,user.id)
        const chatRef = doc(firestore, 'chats', chatId)
        const doSnap = await getDoc(chatRef)

        if (!doSnap.exists()){
            await setDoc(chatRef,
                { 
                          uid: user.id,
                          members: [user.id, user.id],
                          membersInfo: {
                            [user.id]:{
                              username: 'Избранное',
                              photoURL: 'favorites.png'
                            }
                          },
                          updatedAt: serverTimestamp(),
                          lastMessage: "", // передаем сообщение первое если нет чата
                        },
                        { merge: true }
            )
        }

    return true
  },

  
  

}



}















// async jwt({ token, user }) {
//   interface MyUser {
//   id: string;
//   name?: string;
//   email?: string;
//   username?: string | null;
//   image?: string | null;
// }
// console.log('userr до проверки')
// console.log(user)
// if (user) {
//   console.log('userr после')

//   const u = user as MyUser;
//   token.uid = u.id;
//   token.username = u.username ?? null;
//    console.log('u.username', u.username)
//    console.log('u.id', u.id)
//       const { doc, getDoc } = await import("firebase/firestore")
//     const { firestore } = await import("@/firebase")

//     const userId = (user as any).id || token.sub;
//     const userRef = doc(firestore, "users", userId);  
//     const snap = await getDoc(userRef)

//     if (snap.exists()) {
//       token.username = snap.data().username
//     }
  
//     }
//     return token;
//   },



//Кароче надо сбросить эту чертову сессию. а тосейчас user underfined. 