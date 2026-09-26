import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseGreenCookie } from "@/utils/parseTokens";
const apiUrl = 'https://4100.api.green-api.com'

export async function GET(request: Request) {
    
    try
    {
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
console.log('idInstance', idInstance)
console.log('apiTokenInstance', apiTokenInstance)
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

        if (res.status === 200){
        return NextResponse.json({result, message: 'ok'})}
        else{
            return NextResponse.json(
    { message: "Уже есть привязка мессенджера" },
    { status: 502 },
  );
        }
        
    }
    catch(error){
        console.log('error', error)

    return NextResponse.json(
    { message: "Ошибка обработки запроса" },
    { status: 500 },
  );        
    }

}