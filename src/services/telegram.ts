import type { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import { parseGreenCookie } from '@/utils/parseTokens'
import { greenApiUrl } from '@/constants/url'

export const authConfig2: AuthOptions = {
    providers: [Credentials({
        credentials: {},
        async authorize() {
            const cookieStore = await cookies()
            const instance = parseGreenCookie(cookieStore.get('green_pending')?.value)
            if (!instance) return null
            try {
                const res = await fetch(greenApiUrl(instance, 'getAccountSettings'), { cache: 'no-store' })
                if (!res.ok) return null
                const account = await res.json()
                if (!['authorized', 'suspended'].includes(account.stateInstance) ||
                    typeof account.chatId !== 'string' || !account.chatId.trim()) return null
                cookieStore.delete('green_pending')
                return { id: instance.idInstance, ...instance, ownChatId: account.chatId }
            } catch {
                return null
            }
        },
    })],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.idInstance = user.id
                if ('apiTokenInstance' in user) token.apiTokenInstance = user.apiTokenInstance
                if ('messenger' in user) token.messenger = user.messenger
                if ('ownChatId' in user) token.ownChatId = user.ownChatId
            }
            return token
        },
        async session({ session, token }) {
            if (typeof token.idInstance === 'string') {
                session.instance = {
                    idInstance: token.idInstance,
                    messenger: token.messenger === 'max' ? 'max' : 'telegram',
                }
            }
            return session
        },
    },
    pages: { signIn: '/login' },
}
