import { getToken as getSessionToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export const getToken = async function(request: NextRequest) {
    const token = await getSessionToken({ req: request });

    if (
        typeof token?.idInstance !== 'string' || !token.idInstance ||
        typeof token?.apiTokenInstance !== 'string' || !token.apiTokenInstance
    ) {
        return 0;
    }

    return {
        idInstance: token.idInstance,
        apiTokenInstance: token.apiTokenInstance,
        ownChatId: typeof token.ownChatId === 'string' ? token.ownChatId : undefined,
    };
}
