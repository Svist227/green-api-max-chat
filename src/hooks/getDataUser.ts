
import {firestore} from '@/lib/firebase'
import { collection, query, orderBy, getDocs }  from "firebase/firestore";
import { UserFilter } from '@/types/userFilter';
import { isUser } from '@/utils/isUser';
import { useQuery } from '@tanstack/react-query';

async function getUsers(): Promise<UserFilter[]>{
            const usersCollectionRef = collection(firestore, 'users');
            const q = query(usersCollectionRef, orderBy('username')); 
                const usersData: UserFilter[]=[];

                const snapshot = await getDocs(q);
                snapshot.forEach((doc) => {
                    const user = { ...doc.data(), uid: doc.id }
                    if (isUser(user)){
                      usersData.push(user); // Получаем данные и ID документа
                    }
                    else {
                      console.error('Неверные данные пользователя', user)
                    }
                });

                return usersData; // Обновляем состояние с новыми данными
            


}
// получение user-ов и чат-ов
export const useGetDataUser = () => {
    const query = useQuery({
      queryKey:['users'],
      queryFn: getUsers
    })
    
 

        return query

    }

    