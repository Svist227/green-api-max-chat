'use client'
import { FormEventHandler, useState } from "react"
import '../login/login.scss'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import Form from "@/components/block/Form/Form"
export default function SetUsername(){
	const router = useRouter()
	const { update } = useSession()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setErrror] = useState<string>('')
	
     const handleClickCustom:FormEventHandler<HTMLFormElement> = async (event) => {
            event.preventDefault() // остановка всплытия
			setLoading(true)

            const formData = new FormData(event.currentTarget)

		    const data = Object.fromEntries(formData.entries())

            let response = await fetch('/api/set-username',{
			method: 'POST',
			headers:{
			'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(data) // преобразование в JSON
		})	

		const result = await response.json()
		if (result.success) {
			setLoading(false)
			 await update() // обновляем сессию, чтобы получить новый username
 			 router.refresh()
			 router.push('/') // редирект на главную страницу
}
if(!result.success){
	setLoading(false)
	setErrror('Ошибка установки логина, попробуйте еще раз')

}
	}

    return (
<Form loading = {loading} mode = 'setUsername' onSubmit={handleClickCustom} errorLog={error}/>


        
    )
}