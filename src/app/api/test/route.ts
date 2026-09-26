import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseGreenCookie } from "@/utils/parseTokens";

const apiUrl = 'https://4100.api.green-api.com'

export async function POST(request: Request) {

    try
    {
    const { idInstance, apiTokenInstance } = await request.json();
    const url = `${apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`
    const res = await fetch(url, {
        method: 'GET',

      })
const text = await res.text();

console.log("GREEN API status:", res.status);
console.log("GREEN API body:", text);

if (res.status === 401) {
  return NextResponse.json(
    { message: "Неверный ID или токен GREEN API" },
    { status: 401 },
  );
}


if (!res.ok) {
  return NextResponse.json(
    { message: "Ошибка GREEN API" },
    { status: 502 },
  );
}

const result = JSON.parse(text);    

    const cookieStore = await cookies(); 
        cookieStore.set("green_pending", `${idInstance}, ${apiTokenInstance}`, {
    httpOnly: true, // JavaScript браузера не может прочитать
    // secure: process.env.NODE_ENV === "production", // HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 минут, значение в секундах
});
        return NextResponse.json({result, message: 'ok'})
        
    }
    catch(error){
        console.log('error', error)
        return NextResponse.json({error, message: 'Ошибка'})
        
    }

}


export async function GET() {
  try{
    const cookieStore = await cookies(); 
        const value = cookieStore.get("green_pending")?.value;
        const keys = parseGreenCookie(value);
        if (!keys) {
            return NextResponse.json(
                { message: "Ключи отсутствуют или имеют неверный формат" },
                { status: 401 }
            );
        }

         const { idInstance, apiTokenInstance } = keys
         const url = `${apiUrl}/waInstance${idInstance}/qr/${apiTokenInstance}`
        const res = await fetch(url, {
        method: 'GET',

      })
const text = await res.text();

console.log("GREEN API status:", res.status);
console.log("GREEN API body:", text);

if (res.status === 401) {
  return NextResponse.json(
    { message: "Неверный ID или токен GREEN API" },
    { status: 401 },
  );
}


if (!res.ok) {
  return NextResponse.json(
    { message: "Ошибка GREEN API" },
    { status: 502 },
  );
}

const result = JSON.parse(text);  
return NextResponse.json({result, message: 'ok'})

  }
  catch(error){
    console.log('error')
  }
  
}