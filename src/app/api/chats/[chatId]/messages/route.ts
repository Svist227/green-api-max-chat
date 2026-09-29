import { NextResponse, type NextRequest } from 'next/server'
import { apiUrl } from '@/constants/url'
import { getToken } from '@/utils/getToken'
import { SendMessageSchema, SendMessageResponseSchema } from '@/services/sendMessages'

interface RouteParams {
    params: Promise<{
        chatId: string
    }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const tokens = await getToken(request)
        if (tokens === 0) {
            return NextResponse.json({ message: 'Необходимо войти в аккаунт' }, { status: 401 })
        }

        const { chatId } = await params
        const body = await request.json().catch(() => null)
        const payload = SendMessageSchema.safeParse({ chatId, message: body?.message })

        if (!payload.success) {
            return NextResponse.json(
                { message: payload.error.issues[0].message },
                { status: 400 },
            )
        }

        const { idInstance, apiTokenInstance } = tokens
        const url = `${apiUrl}/waInstance${encodeURIComponent(idInstance)}/sendMessage/${encodeURIComponent(apiTokenInstance)}`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload.data),
        })

        if (!res.ok) {
            return NextResponse.json(
                { message: `Не удалось отправить сообщение (GREEN API ${res.status})` },
                { status: res.status },
            )
        }

        const result = SendMessageResponseSchema.safeParse(await res.json())
        if (!result.success) {
            return NextResponse.json(
                { message: 'GREEN API не вернул идентификатор сообщения' },
                { status: 502 },
            )
        }

        return NextResponse.json(result.data)
    } catch {
        return NextResponse.json({ message: 'Ошибка отправки сообщения' }, { status: 500 })
    }
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const tokens = await getToken(request)

        if (tokens === 0) {
            return NextResponse.json(
                { message: 'Необходимо войти в аккаунт' },
                { status: 401 }
            )
        }

        const { chatId } = await params

        if (!chatId) {
            return NextResponse.json(
                { message: 'Не передан chatId' },
                { status: 400 }
            )
        }

        const { idInstance, apiTokenInstance } = tokens

        const url =
            `${apiUrl}/waInstance${encodeURIComponent(idInstance)}` +
            `/getChatHistory/${encodeURIComponent(apiTokenInstance)}`

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId,
                    count: 50
                }),
                cache: 'no-store'
            })

            if (res.status === 401) {
                return NextResponse.json(
                    { message: 'Неверный ID или токен GREEN API' },
                    { status: 401 }
                )
            }

            if (!res.ok) {
                return NextResponse.json(
                    { message: 'Не удалось загрузить сообщения из GREEN API' },
                    { status: 502 }
                )
            }

            const messages = await res.json()

            if (!Array.isArray(messages)) {
                return NextResponse.json(
                    { message: 'Некорректный ответ GREEN API' },
                    { status: 502 }
                )
            }

            return NextResponse.json(messages, {
                headers: {
                    'Cache-Control': 'private, no-store'
                }
            })

        } catch {
            return NextResponse.json(
                { message: 'Не удалось получить ответ GREEN API' },
                { status: 502 }
            )
        }

    } catch {
        return NextResponse.json(
            { message: 'Ошибка обработки запроса' },
            { status: 500 }
        )
    }
}
