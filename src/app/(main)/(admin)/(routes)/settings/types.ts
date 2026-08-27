export interface BankAccount {
    _id: string
    adminId: string
    accountHolder: string
    iban: string
    bic: string
    bankName: string
    createdAt: number
    updatedAt: number
}

export interface Address {
    country: string
    address: string
    houseNumber: string
    postalCode: number
    city: string
}

export interface SepaMandate {
    _id: string
    status: "ACTIVE" | "INACTIVE"
    mandateReference: string
    version: string
    signedOn: number
    fileKey: string
    createdAt: number
    updatedAt: number
}

export interface AdminProfile {
    _id: string
    firstName: string
    lastName: string
    email: string
    drivingSchoolName: string
    partnerId: number
    contactPerson: string
    phone: string
    address: Address
    createdAt: number
    updatedAt: number
}
