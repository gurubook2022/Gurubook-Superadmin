export type AdminT = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: number;
    updatedAt: number;
};
export type UserT = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: number;
    updatedAt: number;
    payment?: PaymentT;
    classes: string[];
    examLanguage: string;
    learningLanguage: string;
};


export type PaymentT = {
    _id: string
    method: string
    paymentId: string
    amount: number
    userId: string
    languageCode: string
    createdAt: number
    updatedAt: number,
}


export type AdminPaymentT = {
    _id: string,
    adminId: string,
    amount: number,
    createdAt: number
    updatedAt: number,
}

export type LangaugeChartDataT = {
    languageTitle: string
    languageCode: string
    count: number
}