import { getToken as getSessionToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { InstanceSchema } from '@/utils/parseTokens'

export async function getToken(request: NextRequest) {
    const token = await getSessionToken({ req: request })
    const instance = InstanceSchema.safeParse({
        messenger: token?.messenger ?? 'telegram',
        idInstance: token?.idInstance,
        apiTokenInstance: token?.apiTokenInstance,
    })
    if (!instance.success) return 0
    // Старая вкладка не должна обращаться к новому инстансу после смены сессии.
    const requestedAccount = request.headers.get('x-instance-key')
    if (requestedAccount && requestedAccount !== `${instance.data.messenger}:${instance.data.idInstance}`) return 0
    return {
        ...instance.data,
        ownChatId: typeof token?.ownChatId === 'string' ? token.ownChatId : undefined,
    }
}
