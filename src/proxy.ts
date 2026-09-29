import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from '@/utils/getToken'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (['/burger.svg', '/cross.svg', '/more.svg', '/search.svg'].includes(pathname)) {
        return NextResponse.next()
    }

    const isAuthenticated = (await getToken(request)) !== 0
    const isAuthPage = pathname === '/login' || pathname === '/register'

    if (isAuthenticated && pathname === '/') {
        return NextResponse.next()
    }

    if (!isAuthenticated && isAuthPage) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL(isAuthenticated ? '/' : '/login', request.url))
}

export const config = {
    matcher: ['/((?!api(?:/|$)|_next(?:/|$)).*)'],
}
