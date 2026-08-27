export interface SepaMandateT {
    _id: string
    status: "ACTIVE" | "INACTIVE"
    mandateReference: string
    version: string
    signedOn: number
    fileKey: string
    createdAt: number
    updatedAt: number
}
