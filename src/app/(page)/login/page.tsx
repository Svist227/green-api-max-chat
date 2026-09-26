'use client'
import { useRouter } from 'next/navigation'
import './login.scss'
import { FormEventHandler,  useState } from 'react'
import { signIn } from "next-auth/react"
import Form from '@/components/block/Form/Form'

export default function Login(){
  const router = useRouter()
	const [error, setErrror] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
    
    // const handleLogin:FormEventHandler<HTMLFormElement> = async (event) => {
    //     event.preventDefault() // остановка всплытия
    //     setLoading(true)


    //     const formData = new FormData(event.currentTarget)

    //     const res = await signIn('credentials',{ 
    //       email: formData.get('email'),
    //       password: formData.get('password'),
    //       redirect: false,
    //      });  

    //     console.log(' идет loading', loading)

        
    //     if (res && !res.error){
    //       setLoading(false)
    //       router.push('/')
    //       return
    //     } 

		// if(res?.error === 'USE_GOOGLE_LOGIN'){
		// 	setErrror('пользователь зарегистрирован через Google')
    //   setLoading(false)
		// } else  
    //   setErrror('Неверный логин или пароль')
    //   setLoading(false)







    // }

    const handleLogin:FormEventHandler<HTMLFormElement> = async (event) => {
     setLoading(true)
    event.preventDefault() // остановка всплытия
    const formData = new FormData(event.currentTarget)

    try{
          const res = await fetch('api/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
    "idInstance": formData.get('idInstance'),
    'apiTokenInstance': formData.get('apiTokenInstance')
})

      })

const status = res.status
    if(status === 200){
            setLoading(false)
            console.log('авторизован')
            router.push('register')
        // авторизован, начинем сессию так-то. и пушим на галвную страницу
        // router.push('/')

    }
    if(status === 401){
    setLoading(false)
    setErrror('Вы еще не авторизованы')
    console.log('Не авторизован')

    }
    if(status === 502){
      setLoading(false)
      setErrror('Введите корректно токены')
         
    }
    }
    catch(eror){
        setLoading(false)

        //  router.push('/странциа qr')
        setErrror('Вы еще не авторизованы')
    }
}







   

    return (

<Form mode = 'signin'  loading = {loading} onSubmit={handleLogin}  errorLog = {error} />
    )
}