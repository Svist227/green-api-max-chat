'use client'
import { useRouter } from 'next/navigation'
import '../login/login.scss'
import { FormEventHandler, useState } from 'react'

import { signIn } from "next-auth/react"
import Form from '@/components/block/Form/Form'

export default function Register(){
    const router = useRouter()
	const [error, setErrror] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const handleRegister:FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setLoading(true)
		const formData = new FormData(event.currentTarget) // передали теку-ий элемент ссылку
		const data = Object.fromEntries(formData.entries())
		let response = await fetch('/api/register',{
			method: 'POST',
			headers:{
			'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(data) // преобразование в JSON
		})	

		const result = await response.json() // получаем ответ

		if(result.message == 'ok'){
			console.log('Пользователь успешно зарегестрирован')
			// дальше авторизация
			const res = await signIn('credentials',{ 
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: false,
         });  

		 if (res && !res.error){
		setLoading(false)
          router.push('/')
          return
        } 
		}

		else if (result.message == 'no') {
			setErrror('Email уже зарегестрирован в системе')
			setLoading(false)


		}
	}
    return (
		<>

<Form mode = 'register' onSubmit={handleRegister} errorLog = {error} loading = {loading}/>
</>
    )

}

   