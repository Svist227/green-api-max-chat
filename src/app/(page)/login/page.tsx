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
            // проверка на привязку.
            let response = await fetch('/api/qr')
            const result = await response.json() 
             if(result.result.type === 'already_registered'){

            const result = await signIn('credentials', {
            redirect: false,
            })

if (result?.ok) {
  router.push('/')
}

             }
             else{
              router.push('/register')
             }
        

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