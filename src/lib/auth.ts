
import {
    getServerSession,
    User,
    type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from 'axios'; // Assuming you have Axios installed


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt", //(1)
    },
    pages: {
        signIn: '/sign-in', //(4) custom signin page path
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                };

                try {
                    const { data: { data: { login } } } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
                        query: `
                        mutation Login($email: String!, $password: String!) {
                          login(email: $email, password: $password) {
                            user {
                              role
                              email
                              _id
                            }
                            refreshToken
                            accessToken
                          }
                        }
                      `,
                        variables: { email, password },
                    });

                    const user = {
                        role: login?.user?.role,
                        email: login?.user?.email,
                        _id: login?.user?._id,
                        refreshToken: login?.refreshToken,
                        accessToken: login?.accessToken,
                    }

                    return user as User
                } catch (error) {
                    // @ts-ignore
                    return null
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            return { ...user, ...token };
        },
        async session({ session, token }) {
            // @ts-ignore
            session.user = token; //(3)
            return session;
        },
    },
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)