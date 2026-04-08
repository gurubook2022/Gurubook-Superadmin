import { GET_ALL_QUESTIONS, GET_BKF_IMAGE_QUESTION_DETAILS, GET_BKF_NUMERICAL_QUESTION, GET_BKF_SOLO_QUESTION_DETAILS, GET_IMAGE_QUESTION_DETAILS, GET_NUMERICAL_QUESTION_DETAILS, GET_SOLO_QUESTION_DETAILS, GET_VIDEO_QUESTION_DETAILS } from "@/graphql/queries";
import { getServerAuthSession } from "@/lib/auth";
import { serverErrorHandler } from "@/lib/utils";
import axios from "axios";

export const getAllQuestions = async (type: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_ALL_QUESTIONS,
            variables: { type }
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

export const getSoloQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_SOLO_QUESTION_DETAILS,
            variables: { _id }
        }, {
            headers: {
                authorization: `${session?.user?.accessToken}`,
            }
        });

        return data
    } catch (error) {

        serverErrorHandler(error)
        // @ts-ignore
        return error?.response
    }
}

export const getImageQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_IMAGE_QUESTION_DETAILS,
            variables: { _id }
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

export const getBkfImageQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_BKF_IMAGE_QUESTION_DETAILS,
            variables: { _id }
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


export const getVideoQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_VIDEO_QUESTION_DETAILS,
            variables: { _id }
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

export const getNumericalQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_NUMERICAL_QUESTION_DETAILS,
            variables: { _id }
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


export const getBkfSoloQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_BKF_SOLO_QUESTION_DETAILS,
            variables: { _id }
        }, {
            headers: {
                authorization: `${session?.user?.accessToken}`,
            }
        });

        return data
    } catch (error) {
        console.log(error)
        serverErrorHandler(error)
        // @ts-ignore
        return error?.response
    }
}




export const getBkfNumericalQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_BKF_NUMERICAL_QUESTION,
            variables: { _id }
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



export const getBkfNumericalImageQuestionDetails = async (_id: string) => {
    const session = await getServerAuthSession()
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
            query: GET_BKF_NUMERICAL_QUESTION,
            variables: { _id }
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