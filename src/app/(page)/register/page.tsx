'use client'
import { useRouter } from 'next/navigation'
import '../login/login.scss'
import { FormEventHandler, useEffect, useState } from 'react'

import { signIn } from "next-auth/react"
import Form from '@/components/block/Form/Form'

export default function Register(){
    const router = useRouter()
	const [error, setErrror] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
    const [qr, setQr] = useState<string>('')

	const handleRegister:FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setLoading(true)

		try{
		let response = await fetch('/api/qr',{
			method: 'GET',
			headers:{
			'Content-Type': 'application/json;charset=utf-8'
			},
		})	

		const result = await response.json() // получаем отве
        const status = response.status // ← ВОТ ТАК

        const {type} = result.result
        console.log(result.status)
    if(type === 'already_registered'){
    setLoading(false)
    setErrror('Вы уже авторизованы, перенаправляю...')
    const result = await signIn('credentials', {
  redirect: false,
})

if (result?.ok) {
  router.push('/')
}
    }
    else if(status === 200 && result.result?.type === 'qrCode'){
            setLoading(false)
            console.log('авторизован')
            console.log('статус', result)
            setQr(result.result.message)



        

    }
    else if(status === 401){
    setLoading(false)
    setErrror('Вы еще не авторизованы')
    console.log('Не авторизован')

    }
    else if(status === 502){
      setLoading(false)
      setErrror('Введите корректно токены')
         
    }

    else{
    setLoading(false)
    console.log(result)
    console.log('какая-то ошибка')
    console.log('статус',status )

    }
    }
    catch(eror){
        setLoading(false)

        //  router.push('/странциа qr')
        setErrror('Вы еще не авторизованы')
    }
	}

    
const hasQr = Boolean(qr)

useEffect(() => {
    if (!hasQr) return

    const intervalId = setInterval(async () => {
        try {
            const response = await fetch('/api/qr')
            const data = await response.json()

            if (!response.ok) {
                console.log('Ошибка:', data)
                return
            }

            const type = data.result?.type

            console.log('worker:', type)

            if (type === 'already_registered') {
                const result = await signIn('credentials', {
                redirect: false,
})

                if (result?.ok) { 
                 console.log('Начинаю сессию')
                clearInterval(intervalId)
                router.push('/')
                return
}
              
            }

            if (type === 'qrCode') {
                // просто обновляем картинку QR
                setQr(data.result.message)
            }

        } catch (error) {
            console.error('Worker error:', error)
        }

    }, 3000)

    return () => {
        clearInterval(intervalId)
    }

}, [hasQr, router])
    return (
		<>

<Form mode = 'register' onSubmit={handleRegister} errorLog = {error} loading = {loading} qr = {qr} />

</>

    )

}

   