import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { parseGreenCookie } from '@/utils/parseTokens'
import { greenApiUrl } from '@/constants/url'

const headers = { 'Cache-Control': 'private, no-store' }

export async function GET() {
    try {
        const instance = parseGreenCookie((await cookies()).get('green_pending')?.value)
        if (!instance) return NextResponse.json({ message: 'Введите ключи инстанса заново' }, { status: 401, headers })
        const stateRes = await fetch(greenApiUrl(instance, 'getStateInstance'), { cache: 'no-store' })
        if (!stateRes.ok) return NextResponse.json({ message: 'Не удалось проверить инстанс' }, { status: stateRes.status, headers })
        const state = await stateRes.json()
        if (['authorized', 'suspended'].includes(state.stateInstance)) {
            return NextResponse.json({ result: { type: 'already_registered' } }, { headers })
        }
        if (state.stateInstance === 'pendingPassword') {
            return NextResponse.json({ result: { type: 'pendingPassword' } }, { headers })
        }
        const res = await fetch(greenApiUrl(instance, 'qr'), { cache: 'no-store' })
        if (!res.ok) return NextResponse.json({ message: 'Не удалось получить QR-код' }, { status: res.status, headers })
        const result = await res.json()
        if (result.type === 'alreadyLogged') result.type = 'already_registered'
        return NextResponse.json({ result }, { headers })
    } catch {
        return NextResponse.json({ message: 'Не удалось получить ответ GREEN API' }, { status: 502, headers })
    }
}

export async function POST(request: Request) {
    try {
        const instance = parseGreenCookie((await cookies()).get('green_pending')?.value)
        if (!instance) return NextResponse.json({ message: 'Введите ключи инстанса заново' }, { status: 401, headers })
        const input = z.object({ password: z.string().min(1).max(256) }).safeParse(await request.json().catch(() => null))
        if (!input.success) return NextResponse.json({ message: 'Введите пароль 2FA' }, { status: 400, headers })
        const res = await fetch(greenApiUrl(instance, 'sendAuthorizationPassword'), {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input.data), cache: 'no-store',
        })
        if (!res.ok) return NextResponse.json({ message: 'Не удалось отправить пароль' }, { status: res.status, headers })
        const result = await res.json()
        if (result.status !== true || result.data?.status !== 'success') {
            const limited = result.data?.reason === 'rate_limit_exceeded'
            return NextResponse.json({ message: limited ? 'Слишком много попыток. Повторите позже' : 'Пароль не принят. Проверьте пароль или обновите QR-код' }, { status: limited ? 429 : 400, headers })
        }
        return NextResponse.json({ message: 'ok' }, { headers })
    } catch {
        return NextResponse.json({ message: 'Не удалось проверить пароль' }, { status: 502, headers })
    }
}
