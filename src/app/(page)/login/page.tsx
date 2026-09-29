'use client'
import './login.scss'
import { useState, type FormEventHandler } from 'react'
import { signIn } from 'next-auth/react'
import Form from '@/components/block/Form/Form'

export default function Login() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault()
        setError('')
        setLoading(true)
        const form = new FormData(event.currentTarget)
        try {
            const res = await fetch('/api/test', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(form)),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Не удалось подключить инстанс')
            if (['authorized', 'suspended'].includes(data.result?.stateInstance)) {
                const result = await signIn('credentials', { redirect: false })
                if (!result?.ok) throw new Error('Не удалось войти. Проверьте состояние инстанса')
                window.location.assign('/')
            } else {
                window.location.assign('/register')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ошибка входа')
        } finally {
            setLoading(false)
        }
    }

    return <Form mode="signin" loading={loading} onSubmit={handleLogin} errorLog={error} />
}
