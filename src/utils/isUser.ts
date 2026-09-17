import { UserFilter } from "@/types/userFilter"
import { Timestamp } from "firebase/firestore"



// Type Guard на данные с бд user-а. Булева проверка что тип соответстует UserFilter
export function isUser(data:unknown): data is UserFilter{
      if ( typeof data !== 'object' || data == null){
        return false
      }

      if (
        !('uid' in data) ||
        !('email' in data) ||
        !('username' in data) ||
        !('photoURL' in data) ||
        !('lastLogin' in data)
      ){
        return false
      }

       return (data.lastLogin instanceof Timestamp) 
      && (typeof data.uid === 'string')
      && (typeof data.email === 'string')
      && (typeof data.username === 'string') 
      && (typeof data.photoURL === 'string' ||  data.photoURL == null)
    }
