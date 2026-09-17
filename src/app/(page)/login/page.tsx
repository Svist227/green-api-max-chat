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
    console.log('loading на момент заполнения формы', loading)
    const handleClickGoogle =  () => {
         signIn('google',{ callbackUrl: '/' });  
    }
    const handleLogin:FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault() // остановка всплытия
        setLoading(true)


        const formData = new FormData(event.currentTarget)

        const res = await signIn('credentials',{ 
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: false,
         });  

        console.log(' идет loading', loading)

        
        if (res && !res.error){
          setLoading(false)
          router.push('/')
          return
        } 

		if(res?.error === 'USE_GOOGLE_LOGIN'){
			setErrror('пользователь зарегистрирован через Google')
      setLoading(false)
		} else  
      setErrror('Неверный логин или пароль')
      setLoading(false)







    }







   

    return (

<Form mode = 'signin'  loading = {loading} onSubmit={handleLogin} onSubmitGoogle={handleClickGoogle} errorLog = {error} />
    )
}