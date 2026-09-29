import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { apiUrl } from '@/constants/url'
import { getToken } from '@/utils/getToken'
import { GreenNotificationSchema, NotificationMessageSchema, ReceiptSchema } from '@/schemas/MessageSchema'

const headers = { 'Cache-Control': 'private, no-store' }

export async function GET(request: NextRequest) {
    try {
        const tokens = await getToken(request)
        if (tokens === 0) {
            return NextResponse.json({ message: 'Необходимо войти в аккаунт' }, { status: 401, headers })
        }

        const { idInstance, apiTokenInstance } = tokens
        const res = await fetch(
            `${apiUrl}/waInstance${encodeURIComponent(idInstance)}/receiveNotification/${encodeURIComponent(apiTokenInstance)}?receiveTimeout=5`,
            { cache: 'no-store', signal: request.signal },
        )
        if (!res.ok) {
            return NextResponse.json(
                { message: `Не удалось получить уведомление (GREEN API ${res.status})` },
                { status: res.status, headers },
            )
        }

        const text = await res.text()
        const data: unknown = text.trim() ? JSON.parse(text) : null
        if (data === null) return NextResponse.json(null, { headers })

        const notification = GreenNotificationSchema.safeParse(data)
        if (!notification.success) {
            return NextResponse.json({ message: 'Некорректное уведомление GREEN API' }, { status: 502, headers })
        }

        const { receiptId, body } = notification.data
        const isMessage = ['incomingMessageReceived', 'outgoingMessageReceived', 'outgoingAPIMessageReceived'].includes(body.typeWebhook)
        const content = z.object({ typeMessage: z.string() }).safeParse(body.messageData)
        const isText = content.success && ['textMessage', 'extendedTextMessage'].includes(content.data.typeMessage)

        // Остальные события подтверждаем без добавления в текстовую переписку.
        if (!isMessage || (content.success && !isText)) {
            return NextResponse.json({ receiptId, message: null }, { headers })
        }

        const message = NotificationMessageSchema.safeParse(body)
        if (!message.success) {
            return NextResponse.json({ message: 'Некорректные данные текстового сообщения' }, { status: 502, headers })
        }

        return NextResponse.json({ receiptId, message: message.data }, { headers })
    } catch {
        return NextResponse.json({ message: 'Не удалось получить уведомление' }, { status: 502, headers })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const tokens = await getToken(request)
        if (tokens === 0) {
            return NextResponse.json({ message: 'Необходимо войти в аккаунт' }, { status: 401, headers })
        }

        const receipt = ReceiptSchema.safeParse(await request.json().catch(() => null))
        if (!receipt.success) {
            return NextResponse.json({ message: 'Некорректный receiptId' }, { status: 400, headers })
        }

        const { idInstance, apiTokenInstance } = tokens
        const res = await fetch(
            `${apiUrl}/waInstance${encodeURIComponent(idInstance)}/deleteNotification/${encodeURIComponent(apiTokenInstance)}/${receipt.data.receiptId}`,
            { method: 'DELETE', cache: 'no-store', signal: request.signal },
        )
        if (!res.ok) {
            return NextResponse.json(
                { message: `Не удалось подтвердить уведомление (GREEN API ${res.status})` },
                { status: res.status, headers },
            )
        }

        const result = z.object({ result: z.boolean() }).safeParse(await res.json())
        if (!result.success || !result.data.result) {
            return NextResponse.json({ message: 'Уведомление не подтверждено' }, { status: 502, headers })
        }

        return NextResponse.json(result.data, { headers })
    } catch {
        return NextResponse.json({ message: 'Не удалось подтвердить уведомление' }, { status: 502, headers })
    }
}
