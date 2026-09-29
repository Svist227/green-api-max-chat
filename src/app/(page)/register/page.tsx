'use client'
import '../login/login.scss'
import { useEffect, useState, type FormEventHandler } from 'react'
import { signIn } from 'next-auth/react'
import Form from '@/components/block/Form/Form'

export default function Register() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [qr, setQr] = useState('')
    const [needsPassword, setNeedsPassword] = useState(false)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>
        const poll = async () => {
            let delay = 3000
            try {
                const res = await fetch('/api/qr', { cache: 'no-store' })
                const data = await res.json()
                if (cancelled) return
                if (!res.ok) {
                    setError(data.message || 'Не удалось получить QR-код')
                    if (res.status === 401) return
                    delay = 10000
                } else if (data.result?.type === 'already_registered') {
                    const result = await signIn('credentials', { redirect: false })
                    if (cancelled) return
                    if (result?.ok) { window.location.assign('/'); return }
                    setError('Не удалось создать сессию. Повторите вход')
                    return
                } else if (data.result?.type === 'pendingPassword') {
                    setNeedsPassword(true)
                    setQr('')
                    setError('')
                    return
                } else if (data.result?.type === 'qrCode') {
                    setQr(data.result.message)
                    setNeedsPassword(false)
                    setError('')
                } else {
                    setError(data.result?.message || 'Инстанс ещё не готов. Ожидаем QR-код…')
                    delay = 10000
                }
            } catch {
                if (cancelled) return
                setError('Не удалось связаться с сервером')
                delay = 10000
            }
            if (!cancelled) timer = setTimeout(poll, delay)
        }
        void poll()
        return () => { cancelled = true; clearTimeout(timer) }
    }, [attempt])

    const handleRegister: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault()
        if (!needsPassword) { setAttempt(value => value + 1); return }
        const form = new FormData(event.currentTarget)
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/qr', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: form.get('password') }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Пароль не принят')
            setNeedsPassword(false)
            setAttempt(value => value + 1)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Не удалось проверить пароль')
        } finally {
            setLoading(false)
        }
    }

    return <Form mode="register" onSubmit={handleRegister} loading={loading}
        errorLog={error} qr={qr} needsPassword={needsPassword} />
}
