

// техничесий долг
// export {default} from 'next-auth/middleware'
  import { NextResponse } from 'next/server'
  import { NextRequest } from 'next/server'
  import { getToken } from 'next-auth/jwt'
  // This function can be marked `async` if using `await` inside

  
  export async function middleware(req: NextRequest) {
  //   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  //   const isAuth = !!token
  //   console.log('token in middleware', token); // <- убедись, что username есть



  //   const pathname = req.nextUrl.pathname
  //   const publicRoutes = ['/login', '/register','/set-username','/test']

  //   // Не авторизован
  //   if (!isAuth && !publicRoutes.includes(pathname)) {
  //     return NextResponse.redirect(new URL('/login', req.url))
  //   }

  //   // Авторизован но без username
  //   if ( isAuth && !token?.username && pathname !== '/set-username') {
  //      return NextResponse.redirect(new URL('/set-username', req.url))
  //   }

  //   console.log('token?.username', token?.username)
  //   // авторизован и username есть, но пытается зайти на login
  // if (isAuth && token?.username && publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }


  //   return NextResponse.next();
  // 
  }
  
  // See "Matching Paths" below to learn more
  export const config = {
   matcher:   '/((?!_next|api|.*\\..*).*)',
  }
  


  //  matcher:   '/((?!_next|api|.*\\..*).*)',


  // кароче проблема только с редиректом. там мидл мне мешает. он видимо не дает нормально отработать редиректу. я так понимаю, что при редиректе на /set-username, мидл видит, что юзер авторизован, но у него нет юзернейма, и снова кидает на /set-username. и так по кругу. нужно как-то сделать исключение для этого роута в мидле, чтобы он не мешал редиректу отрабатывать. я уже пробовал разные варианты с matcher, но пока безуспешно. может ты подскажешь, как правильно настроить matcher, чтобы он пропускал редирект на /set-username?