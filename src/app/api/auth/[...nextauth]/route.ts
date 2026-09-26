import { authConfig2 } from "@/services/telegram";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig2)




export {handler as GET, handler as POST}