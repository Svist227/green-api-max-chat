import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseGreenCookie } from "@/utils/parseTokens";

const apiUrl = 'https://4100.api.green-api.com'


export async function POST(request: Request) {
        const cookieStore = await cookies(); 

    try{
        const {number} = await request.json()
        const value = await cookieStore.get("green_pending")?.value;
        const keys = parseGreenCookie(value);
        if (!keys) {
    return NextResponse.json(
        { message: "Ключи отсутствуют или имеют неверный формат" },
        { status: 401 }
    );
}

        const { idInstance, apiTokenInstance } = keys;

        // надо достать из куки 
    const url = `${apiUrl}/waInstance${idInstance}/qr/${apiTokenInstance}`
          const res = await fetch(url, {
        method: 'GET',

      })

    const status = res.status
    
    if(status === 200){
        const data = await res.json();
        console.log('успех')
        return NextResponse.json(data, {status:status})
        
    }
    }
    catch(error){
        console.log(error)
        return NextResponse.json({message: 'no'})
        
    }

}