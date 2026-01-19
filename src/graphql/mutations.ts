import { gql } from '@apollo/client';

export const REGISTER_ADMIN = gql`
mutation RegisterAdmin($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    registerAdmin(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      _id
      firstName
      lastName
      email
      role
      createdAt
      updatedAt
    }
  }
`;


export const DELETE_ADMIN = gql`
mutation DeleteAdmin($_id: String!) {
  deleteAdmin(_id: $_id)
}`


export const REGISTER_USER = gql`mutation Register($firstName: String!, $lastName: String!, $email: String!, $role: Role!, $password: String!, $phone: String!, $address: AddressInput!) {
  register(firstName: $firstName, lastName: $lastName, email: $email, role: $role, password: $password, phone: $phone, address: $address) {
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

export const USERREGISTERBYADMIN = gql`mutation UserRegisterByAdmin($userId: String!) {
  userRegisterByAdmin(userId: $userId) {
    _id
    adminId
    userId
    createdAt
    updatedAt
  }
}`

export const MAKE_CASH_PAYMENT = gql`mutation MakeCashPayment($userId: ID!, $languageCode: String!, $classes: [String!]!, $examLanguage: String!, $learningLanguage: String) {
  makeCashPayment(userId: $userId, languageCode: $languageCode, classes: $classes, examLanguage: $examLanguage, learningLanguage: $learningLanguage) {
    _id
    method
    paymentId
    amount
    userId
    createdAt
    updatedAt
  }
}
`

export const VERIFYUSER = `mutation VerifyUser($userId: String!, $verificationToken: String!) {
  verifyUser(userId: $userId, verificationToken: $verificationToken) {
    _id
    firstName
    lastName
    email
    role
    isVerified
    createdAt
    updatedAt
  }
}`

export const UPDATE_PRICE = gql`mutation UpdatePrice($vat: Float!, $dlApprovedLanguages: Float!,  $dlNonApprovedLanguages: Float!,  $bkfApprovedLanguages: Float!,  $bkfNonApprovedLanguages: Float!,  $_id: ID) {
  updatePrice(vat: $vat, dlApprovedLanguages: $dlApprovedLanguages, dlNonApprovedLanguages: $dlNonApprovedLanguages, bkfApprovedLanguages: $bkfApprovedLanguages, bkfNonApprovedLanguages: $bkfNonApprovedLanguages,  _id: $_id) {
    _id
    vat
    dlApprovedLanguages
    dlNonApprovedLanguages
    bkfApprovedLanguages
    bkfNonApprovedLanguages
    createdAt
    updatedAt
  }
}`


export const UPLOAD_QUESTIONS = gql`mutation UploadQuestions($url: String!) {
  uploadQuestions(url: $url)
}`

export const UPDATE_SOLO_QUESTION = gql`mutation UpdateDlQuestion($_id: ID!, $points: Float!, $questionNumber: String!, $classes: [String!]!, $chapters: [String!]!, $options: [OptionInput!]!, $questionData: [QuestionDataInput!]!) {
  updateDlQuestion(_id: $_id, points: $points, questionNumber: $questionNumber, classes: $classes, chapters: $chapters, options: $options, questionData: $questionData)
}`

export const DELETE_SOLO_QUESTION = gql`mutation DeleteSoloQuestion($_id: ID!) {
  deleteSoloQuestion(_id: $_id)
}`

export const UPDATE_IMAGE_QUESTION = gql`mutation UpdateDlQuestion($_id: ID!, $points: Float!, $questionNumber: String!, $classes: [String!]!,$chapters: [String!]!, $options: [OptionInput!]!, $questionData: [QuestionDataInput!]!, $imageUrl: String!) {
  updateDlQuestion(_id: $_id, points: $points, questionNumber: $questionNumber, classes: $classes, chapters: $chapters, options: $options, questionData: $questionData, imageUrl: $imageUrl)
}`

export const DELETE_IMAGE_QUESTION = gql`mutation DeleteImageQuestion($_id: ID!) {
  deleteImageQuestion(_id: $_id)
}`

export const UPDATE_NUMERICAL_QUESTION = gql`mutation UpdateDlQuestion($_id: ID!, $points: Float!, $solution: String, $solution1: String, $questionNumber: String!, $classes: [String!]!, $chapters: [String!]!, $questionData: [QuestionDataInput!]!, $imageUrl: String) {
  updateDlQuestion(_id: $_id, points: $points, solution: $solution, solution1: $solution1, questionNumber: $questionNumber, classes: $classes, chapters: $chapters, questionData: $questionData, imageUrl: $imageUrl)
}`

export const DELETE_NUMERICAL_QUESTION = gql`mutation DeleteNumericalQuestion($_id: ID!) {
  deleteNumericalQuestion(_id: $_id)
}`

export const UPDATE_VIDEO_QUESTION = gql`mutation UpdateVideoQuestion($_id: ID!, $points: Float!, $questionNumber: String!, $classes: [String!]!,$chapters: [String!]!, $options: [OptionInput!]!, $questionData: [VideoQuestionDataInput!]!, $videoUrl: String!, $startImageUrl: String!, $endImageUrl: String! ) {
  updateVideoQuestion(_id: $_id, points: $points, questionNumber: $questionNumber, classes: $classes,chapters: $chapters, options: $options, questionData: $questionData, videoUrl: $videoUrl,startImageUrl:$startImageUrl, endImageUrl: $endImageUrl)
}`

export const DELETE_VIDEO_QUESTION = gql`mutation DeleteVideoQuestion($_id: ID!) {
  deleteVideoQuestion(_id: $_id)
}`

export const UPLOAD_ASSETS = gql`mutation UploadAssets($url: String!, $questionNumber: String!) {
  uploadAssets(url: $url, questionNumber: $questionNumber)
}`

export const ADMIN_PAYMENT_RECEIVED = gql`mutation AdminPaymentReceived($adminId: ID!) {
  adminPaymentReceived(adminId: $adminId)
}`

export const DELETE_BKF_SOLO_QUESTION = gql`mutation DeleteBkfSoloQuestion($_id: ID!) {
  deleteBkfSoloQuestion(_id: $_id)
}`

export const DELETE_BKF_IMAGE_QUESTION = gql`mutation DeleteBkfImageQuestion($_id: ID!) {
  deleteBkfImageQuestion(_id: $_id)
}`

export const DELETE_BKF_NUMERICAL_QUESTION = gql`mutation DeleteBkfNumericalQuestion($_id: ID!) {
  deleteBkfNumericalQuestion(_id: $_id)
}`

export const REFUND_PAYMENT = gql`mutation RefundPayment($paymentId: ID!) {
  refundPayment(paymentId: $paymentId)
}`


export const CREATE_NOTIFICATION = gql`mutation CreateNotification($content: String!, $notificationFor: String!) {
  createNotification(content: $content, notificationFor: $notificationFor)
}`

export const LOGOUT = gql`
mutation Mutation {
  logout
}`

export const UPDATE_BKF_QUESTION = gql`
mutation UpdateBkfQuestion($_id: ID!, $points: Float!, $questionType: String!, $questionNumber: String!, $classes: [String!]!, $chapters: [String!]!, $options: [OptionInput], $questionData: [BkfQuestionDataInput!]!, $solution: String, $solution1: String, $imageUrl: String) {
  updateBkfQuestion(_id: $_id, points: $points, questionType: $questionType, questionNumber: $questionNumber, classes: $classes, chapters: $chapters, options: $options, questionData: $questionData, solution: $solution, solution1: $solution1, imageUrl: $imageUrl)
}
`