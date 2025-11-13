import { GET_PRICES } from "@/graphql/queries";
import { getServerAuthSession } from "@/lib/auth";
import { serverErrorHandler } from "@/lib/utils";
import axios from "axios";

export const getPrice = async () => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_PRICES
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