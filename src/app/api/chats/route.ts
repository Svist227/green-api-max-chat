import type { Chat } from '@/types/chat'
import { NextResponse, type NextRequest } from 'next/server';
import { greenApiUrl } from '@/constants/url';
import { getToken } from '@/utils/getToken';
import { z } from 'zod';
import { ChatSchema } from '@/types/chat';

const PhoneSearchSchema = z.object({
    phoneNumber: z.string().regex(/^[1-9]\d{7,14}$/)
        .refine(phone => !phone.startsWith('7') || phone.length === 11),
});

const AccountSchema = z.object({
    exist: z.boolean(),
    chatId: z.string().default(''),
});

const ContactSchema = z.object({
    chatId: z.string().min(1),
    chatType: ChatSchema.shape.type,
    name: z.string(),
    contactName: z.string().optional(),
    username: z.string().nullish(),
    phoneNumber: z.number().nullish(),
});

export async function POST(request: NextRequest) {
    const headers = { 'Cache-Control': 'private, no-store' };
    try {
        const tokens = await getToken(request);
        if (tokens === 0) {
            return NextResponse.json({ message: 'Необходимо войти в аккаунт' }, { status: 401, headers });
        }

        const input = PhoneSearchSchema.safeParse(await request.json().catch(() => null));
        if (!input.success) {
            return NextResponse.json({ message: 'Введите полный номер телефона с кодом страны' }, { status: 400, headers });
        }

        const accountRes = await fetch(greenApiUrl(tokens, 'checkAccount'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: Number(input.data.phoneNumber) }),
            cache: 'no-store',
        });
        if (!accountRes.ok) {
            return NextResponse.json(
                { message: `Не удалось проверить номер (GREEN API ${accountRes.status})` },
                { status: accountRes.status, headers },
            );
        }

        const accountData = await accountRes.json();
        // Ограничение Telegram может прийти с HTTP 200.
        if (accountData?.status === false) {
            const limited = accountData?.data?.reason === 'rate_limit_exceeded';
            return NextResponse.json(
                { message: limited ? 'Мессенджер ограничил поиск по номерам. Повторите позже' : 'Проверка номера сейчас недоступна' },
                { status: limited ? 429 : 502, headers },
            );
        }
        const account = AccountSchema.safeParse(accountData);
        if (!account.success || (account.data.exist && !account.data.chatId)) {
            return NextResponse.json({ message: 'Некорректный ответ проверки номера' }, { status: 502, headers });
        }
        if (!account.data.exist) return NextResponse.json(null, { headers });

        const contactRes = await fetch(greenApiUrl(tokens, 'getContactInfo'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: account.data.chatId }),
            cache: 'no-store',
        });
        if (!contactRes.ok) {
            return NextResponse.json(
                { message: `Не удалось получить контакт (GREEN API ${contactRes.status})` },
                { status: contactRes.status, headers },
            );
        }

        const contact = ContactSchema.safeParse(await contactRes.json());
        if (!contact.success || contact.data.chatId !== account.data.chatId) {
            return NextResponse.json({ message: 'Некорректные данные контакта' }, { status: 502, headers });
        }

        const chat: Chat = {
            chatId: contact.data.chatId,
            type: contact.data.chatType,
            name: contact.data.contactName || contact.data.name || contact.data.username || `+${input.data.phoneNumber}`,
            username: contact.data.username || null,
            phoneNumber: contact.data.phoneNumber || Number(input.data.phoneNumber),
            isSelf: contact.data.chatId === tokens.ownChatId,
        };
        return NextResponse.json(chat, { headers });
    } catch {
        return NextResponse.json({ message: 'Не удалось найти контакт' }, { status: 502, headers });
    }
}

export async function GET(request: NextRequest) {
    try {
        const tokens = await getToken(request);

        if (tokens === 0) {
            return NextResponse.json(
                { message: 'Необходимо войти в аккаунт' },
                { status: 401 },
            );
        }

        const contactsOnly = tokens.messenger === 'max' && request.nextUrl.searchParams.get('contacts') === 'true';
        const url = greenApiUrl(tokens, contactsOnly ? 'getContacts' : 'getChats');

        try {
            const res = await fetch(url, { cache: 'no-store' });

            if (res.status === 401) {
                return NextResponse.json(
                    { message: 'Неверный ID или токен GREEN API' },
                    { status: 401 },
                );
            }

            if (!res.ok) {
                return NextResponse.json(
                    { message: contactsOnly ? 'Не удалось загрузить контакты MAX' : 'Не удалось загрузить чаты из GREEN API' },
                    { status: 502 },
                );
            }

            const chats = z.array(ChatSchema.extend({ contactName: z.string().nullish() })).safeParse(await res.json());

            if (!chats.success) {
                return NextResponse.json(
                    { message: 'Некорректный ответ GREEN API' },
                    { status: 502 },
                );
            }

            const chatsWithSelf = chats.data.map(chat => ({
                ...chat,
                name: chat.contactName || chat.name,
                isSelf: Boolean(tokens.ownChatId) && chat.chatId === tokens.ownChatId,
            }));

            return NextResponse.json(chatsWithSelf, {
                headers: { 'Cache-Control': 'private, no-store' },
            });
        } catch {
            return NextResponse.json(
                { message: 'Не удалось получить ответ GREEN API' },
                { status: 502 },
            );
        }
    } catch {
        return NextResponse.json(
            { message: 'Ошибка обработки запроса' },
            { status: 500 },
        );
    }
}
