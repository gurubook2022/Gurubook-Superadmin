export type InvoiceStudentT = {
    accountId: string;
    name: string;
    licenceType: string;
    existingClasses: string[];
    learningForClasses: string[];
    examLanguage: string | null;
    learningLanguage: string | null;
    createdOn: number;
    price: number;
    status: string;
};

export type MonthlyInvoiceT = {
    month: number;
    year: number;
    status: "OPEN" | "PAID";
    periodLabel: string;
    finalizedOn: number | null;
    invoiceNumber: string | null;
    studentsCount: number;
    netAmount: number;
    vatPercentage: number;
    totalAmount: number;
    pdfKey: string | null;
    students: InvoiceStudentT[];
};
