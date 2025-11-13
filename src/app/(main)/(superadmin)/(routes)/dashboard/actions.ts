import { GET_ALL_USERS } from "@/graphql/queries";
import { getServerAuthSession } from "@/lib/auth";
import { serverErrorHandler } from "@/lib/utils";
import axios from "axios";

export const getAllUsers = async () => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_ALL_USERS
        }, {
            headers: {
                authorization: `${session?.user?.accessToken}`,
            }
        });
        return data
    } catch (error) {
        serverErrorHandler(error)
        return null
    }
}

