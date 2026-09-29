import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { greenApiUrl, messengers } from '@/constants/url'
import { InstanceSchema } from '@/utils/parseTokens'

export async function POST(request: Request) {
    try {
        const parsed = InstanceSchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) {
            return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
        }
        const instance = parsed.data
        const settingsRes = await fetch(greenApiUrl(instance, 'getSettings'), { cache: 'no-store' })
        if (!settingsRes.ok) {
            return NextResponse.json({ message: 'Проверьте ID и токен инстанса' }, { status: settingsRes.status })
        }
        const settings = await settingsRes.json()
        if (settings.typeInstance !== messengers[instance.messenger].typeInstance) {
            return NextResponse.json({ message: 'Инстанс не соответствует выбранному мессенджеру' }, { status: 400 })
        }
        const stateRes = await fetch(greenApiUrl(instance, 'getStateInstance'), { cache: 'no-store' })
        if (!stateRes.ok) {
            return NextResponse.json({ message: 'Не удалось проверить состояние инстанса' }, { status: stateRes.status })
        }
        const result = await stateRes.json()
        const cookieStore = await cookies()
        cookieStore.set('green_pending', JSON.stringify(instance), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', path: '/', maxAge: 60 * 10,
        })
        return NextResponse.json({ result }, { headers: { 'Cache-Control': 'private, no-store' } })
    } catch {
        return NextResponse.json({ message: 'Не удалось подключиться к GREEN API' }, { status: 502 })
    }
}
