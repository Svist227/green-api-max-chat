
// import { NextResponse, type NextRequest } from 'next/server';
// import { apiUrl } from '@/constants/url';
// import { getToken } from '@/utils/getToken';

// export async function GET(request: NextRequest) {
//     const chatId = new URL(request.url).searchParams.get('chatId');

//     if (!chatId) {
//         return NextResponse.json(
//             { message: 'Некорректный chatId' },
//             { status: 400 },
//         );
//     }

//     try {
//         const tokens = await getToken(request);

//         if (tokens === 0) {
//             return NextResponse.json(
//                 { message: 'Необходимо войти в аккаунт' },
//                 { status: 401 },
//             );
//         }

//         const { idInstance, apiTokenInstance } = tokens;
//         const url = `${apiUrl}/waInstance${encodeURIComponent(idInstance)}/getAvatar/${encodeURIComponent(apiTokenInstance)}`;

//         const res = await fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ chatId }),
//         });

//         if (!res.ok) {
//             const details = (await res.text()).replaceAll(apiTokenInstance, '[скрыто]');

//             return NextResponse.json(
//                 { message: `Ошибка GREEN API (${res.status})`, details },
//                 { status: res.status },
//             );
//         }

//         const data = await res.json();
//         return NextResponse.json({ urlAvatar: data.urlAvatar });
//     } catch {
//         return NextResponse.json(
//             { message: 'Ошибка обработки запроса' },
//             { status: 500 },
//         );
//     }
// }
