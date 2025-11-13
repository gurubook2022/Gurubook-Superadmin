import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
    refreshToken: string;
    accessToken: string;
    role: string;
    email: string;
    _id: string
}

declare module "next-auth" {
    interface User extends IUser { }
    interface Session {
        user?: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends IUser { }
}