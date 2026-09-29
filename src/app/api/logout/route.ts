import { apiUrl } from "@/constants/url"
import { getToken } from "@/utils/getToken";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const tokens = await getToken(request)

    if(tokens === 0){
        return NextResponse.json(
            { message: "Необходимо войти в аккаунт" },
            { status: 401 }
        );
    }
    const {idInstance, apiTokenInstance} = tokens

    const url = `${apiUrl}/waInstance${idInstance}/logout/${apiTokenInstance}`

    const res = await fetch(url) // Response объект 

    const result = await res.json() // получаем ответ  преобразование из json в js объект

    if(result.isLogout === true){
        return NextResponse.json(
            {message: 'ok'}
        )
    }
    else{
         return NextResponse.json(
            {message: 'no'},
            {status: 401}
        )
    }
    

}
