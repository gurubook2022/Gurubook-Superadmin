import { gql } from '@apollo/client';

export const HELLO = gql`
query Query {
    hello
  }
`;


export const GET_ALL_QUESTIONS = `query GetQuestions($type: QuestionFor!) {
  getQuestions(type: $type)
}
`

export const GET_SOLO_QUESTION_DETAILS = `query GetSoloQuestionDetails($_id: ID!) {
  getSoloQuestionDetails(_id: $_id) 
}`


export const GET_VIDEO_QUESTION_DETAILS = `query GetImageQuestionDetails($_id: ID!) {
  getVideoQuestionDetails(_id: $_id) 
}
`

export const GET_NUMERICAL_QUESTION_DETAILS = `query GetNumericalQuestionDetails($_id: ID!) {
  getNumericalQuestionDetails(_id: $_id) 
}`


export const GET_IMAGE_QUESTION_DETAILS = `query GetImageQuestionDetails($_id: ID!) {
  getImageQuestionDetails(_id: $_id) 
}`

export const GET_BKF_SOLO_QUESTION_DETAILS = `query GetBkfSoloQuestionDetails($_id: ID!) {
  getBkfSoloQuestionDetails(_id: $_id)
}`

export const GET_INVOICES = `
query Query {
  getInvoices {
    _id
    userId
    description
    invoiceNumber
    unitPrice
    vatPercentage
    createdAt
    updatedAt
    name
    email
    address
  }
}`


export const GET_ALL_ADMINS = `
query Query {
  getAllAdmins {
    _id
    firstName
    lastName
    email
    role
    createdAt
  }
}`


export const GET_ADMINS_DETAILS = `
query GetAdminDetails($id: String!) {
  getAdminDetails(_id: $id) {
    _id
    firstName
    lastName
    email
    role
    createdAt
    updatedAt
  }
}`

export const GET_ALL_USERS = `query GetAllUsers {
  getAllUsers {
    _id
    firstName
    lastName
    email
    role
    isVerified
    status
    createdAt
    updatedAt
    payment {
      _id
      method
      paymentId
      amount
      userId
      languageCode
      createdAt
      updatedAt
    }
    address {
      country
      address
      postalCode
      city
    }
    examLanguage
    learningLanguage
    classes
  }
}`

export const GET_USERS_REGISTERED_BY_ADMIN = `query GetUsersRegisteredByAdmin($adminId: String) {
  getUsersRegisteredByAdmin(adminId: $adminId) {
    _id
    firstName
    lastName
    email
    role
    isVerified
    status
    createdAt
    updatedAt
    payment {
      _id
      method
      paymentId
      amount
      userId
      languageCode
      createdAt
      updatedAt
    }
    address {
      country
      address
      postalCode
      city
    }
    examLanguage
    learningLanguage
    classes
    lastLoginAt
    progress
  }
}`

export const GET_PRICES = `query GetPrices {
  getPrices {
    _id
    vat
    dlApprovedLanguages
    dlNonApprovedLanguages
    bkfApprovedLanguages
    bkfNonApprovedLanguages
    pricePerRegisteredStudent
    createdAt
    updatedAt
  }
}`

const MONTHLY_INVOICE_FIELDS = `
    month
    year
    status
    periodLabel
    finalizedOn
    invoiceNumber
    studentsCount
    netAmount
    vatPercentage
    totalAmount
    pdfKey
    students {
      accountId
      name
      licenceType
      existingClasses
      learningForClasses
      examLanguage
      learningLanguage
      createdOn
      price
      status
    }
`

export const GET_CURRENT_MONTHLY_INVOICE = `query GetCurrentMonthlyInvoice {
  getCurrentMonthlyInvoice {
    ${MONTHLY_INVOICE_FIELDS}
  }
}`

export const GET_PREVIOUS_MONTHLY_INVOICES = `query GetPreviousMonthlyInvoices($monthsBack: Int) {
  getPreviousMonthlyInvoices(monthsBack: $monthsBack) {
    ${MONTHLY_INVOICE_FIELDS}
  }
}`

export const GET_ADMIN_PAYMENTS = `query GetAdminPayments($adminId: ID!) {
  getAdminPayments(adminId: $adminId) {
    _id
    amount
    adminId
    createdAt
    updatedAt
  }
}`

export const GET_BKF_IMAGE_QUESTION_DETAILS = `query GetBkfImageQuestionDetails($_id: ID!) {
  getBkfImageQuestionDetails(_id: $_id) 
}`

export const GET_BKF_NUMERICAL_QUESTION = `query GetBkfNumericalQuestionDetails($_id: ID!) {
  getBkfNumericalQuestionDetails(_id: $_id) 
}`

export const GET_LANGUAGES_CHART_DATA = `query GetLanguagesChartData {
  getLanguagesChartData {
    languageTitle
    languageCode
    count
  }
}`

export const GET_BANK_ACCOUNT = `query GetBankAccount {
  getBankAccount {
    _id
    adminId
    accountHolder
    iban
    bic
    bankName
    createdAt
    updatedAt
  }
}`

export const GET_SEPA_MANDATE = `query GetSepaMandate {
  getSepaMandate {
    _id
    status
    mandateReference
    version
    signedOn
    fileKey
    createdAt
    updatedAt
  }
}`

export const GET_ADMIN_PROFILE = `query GetAdminProfile {
  getAdminProfile {
    _id
    firstName
    lastName
    email
    drivingSchoolName
    partnerId
    contactPerson
    phone
    address {
      country
      address
      houseNumber
      postalCode
      city
    }
    createdAt
    updatedAt
  }
}`