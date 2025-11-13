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
    _id: string;
    method: string;
    paymentId: string;
    amount: number;
    userId: string;
    languageCode: string;
    createdAt: number;
    updatedAt: number;
};

export type LanguageT = {
    _id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
};
