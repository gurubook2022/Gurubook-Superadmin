import { GET_ADMINS_DETAILS, GET_ADMIN_PAYMENTS, GET_ALL_ADMINS, GET_USERS_REGISTERED_BY_ADMIN } from "@/graphql/queries";
import { getServerAuthSession } from "@/lib/auth";
import { serverErrorHandler } from "@/lib/utils";
import axios from "axios";

export const getAllAdmins = async () => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_ALL_ADMINS
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


export const getAdminDetails = async (id: string) => {
    if (id === "create") return null
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_ADMINS_DETAILS,
            variables: { id },
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

export const getUserRegisterByAdmin = async (slug: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_USERS_REGISTERED_BY_ADMIN,
            variables: { adminId: slug }
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



export const getAdminPayments = async (adminId: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_ADMIN_PAYMENTS,
            variables: { adminId }
        }, {
            headers: {
                authorization: `${session?.user?.accessToken}`,
            }
        });
        return data?.data?.getAdminPayments
    } catch (error) {
        serverErrorHandler(error)
        return null
    }
}