

export type QuestionT = DlQuestion | BKFQuestion;
// export type QuestionT = {
//     _id: string,
//     questionType: string,
//     questionId: string
//     data: DataT
// }

// export type BkfSoloQuestion = {
//     _id: string,
//     points: number,
//     questionNumber: string,
//     chapter: string,
//     questionData: OptionData[]
//     questionType: string,
//     questionId: string
// }

export type OptionData = {
    _id?: string,
    language: string,
    content: string,
    audio?: string,
    highlightedWord?: string
}

export type Option = {
    _id?: string,
    isCorrect: boolean,
    optionData: OptionData[]
}

export type QuestionData = {
    language: string,
    title: string,
    titleAudio: string,
    subTitle?: string,
    subTitleAudio?: string,
    remarks: string,
    remarksAudio: string,
    textInputQuestionOne?: string,
    textInputQuestionOneAudio?: string,
    textInputQuestionTwo?: string,
    textInputQuestionTwoAudio?: string,
    textInputQuestionThree?: string,
    textInputQuestionThreeAudio?: string,
    imageText?: string,
    imageTextAudio?: string
}

export type DlQuestion = {
    questionType: "Numerical" | "Solo" | "Image" | "Video",
    chapters: string[],
    questionNumber: string,
    points: number,
    classes: string[],
    solution?: string,
    solution1?: string,
    videoUrl?: string,
    startImageUrl?: string,
    endImageUrl?: string,
    imageUrl?: string,
    questionData: QuestionData[],
    options: Option[],
    createdAt: Date,
    updatedAt: Date,
    _id: string
};

export type BKFQuestion = {
    questionType: "Bkf Solo" | "Bkf Image" | "Bkf Numerical",
    chapters: string[],
    questionNumber: string,
    points: number,
    classes: string[],
    solution?: string,
    solution1?: string,
    imageUrl?: string,
    questionData: Omit<QuestionData, "imageText" | "imageTextAudio" | "remarksAudio" | "subTitle" | "subTitleAudio">[],

    options: Option[],
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

// export type ImageQuestion = {
//     questionType: string,
//     questionId: string,
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: QuestionsData[]
//     imageUrl: string
// }

// export type VideoQuestion = {
//     questionType: string,
//     questionId: string,
//     _id: string,
//     points: number,
//     questionNumber: string
//     questionData: QuestionsData[]
//     videoUrl: string
// }

// export type NumericalQuestion = {
//     questionType: string,
//     questionId: string
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: NumericalQuestionData[]
// }
// export type QuestionsData = {
//     _id: string,
//     language: string,
//     title: string,
//     titleAudio: string
//     subTitle: string
//     subTitleAudio: string
//     remarks: string
//     remarksAudio: string
// }



// export type SoloQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: QuestionsData[],
//     classes: string[],
//     options: Option[]
//     chapters: string[]
// }


// export type VideoQuestionT = {
//     _id: string,
//     points: number,
//     questionNumber: string
//     questionData: QuestionsData[]
//     videoUrl: string
//     classes: string[]
//     options: Option[]
//     chapters: string[]
// }

// export type NumericalQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: NumericalQuestionData[]
//     classes: string[]
//     imageUrl: string
//     chapters: string[]
// }

// export type ImageQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: ImageQuestionData[]
//     imageUrl: string
//     classes: string[]
//     options: Option[]
//     chapters: string[]
// }
// export type ImageQuestionData = QuestionsData & { imageText: string };

// export type BkfSoloQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: (Omit<QuestionsData, "subTitle" | "subTitleAudio">)[],
//     classes: string[],
//     options: Option[]
//     chapter: string
// }


// export type BkfImageQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: Omit<QuestionsData, "subTitle" | "subTitleAudio">[]
//     imageUrl: string
//     classes: string[]
//     options: Option[]
//     chapter: string
// }


// export type Option = {
//     _id: string,
//     isCorrect: boolean,
//     optionData: OptionData[]
// }

// export type OptionData = {
//     _id: string,
//     language: string,
//     content: string
//     audio: string
// }



// export type BkfNumericalQuestionT = {
//     _id: string
//     points: number
//     questionNumber: string
//     questionData: BkfNumericalQuestionData[]
//     classes: string[]
//     imageUrl: string
//     chapter: string
// }



// export type BkfNumericalQuestionData = {
//     _id: string,
//     language: string,
//     title: string,
//     titleAudio: string,
//     remarks: string
//     remarksAudio: string
//     textInputQuestionOne?: string
//     textInputQuestionOneAudio?: string
//     textInputQuestionTwo?: string
//     textInputQuestionTwoAudio?: string
//     textInputQuestionThree?: string
//     textInputQuestionThreeAudio?: string
// }


// export type NumericalQuestionData = {

//     _id: string,
//     language: string,
//     title: string,
//     titleAudio: string,
//     subTitle?: string,
//     subTitleAudio?: string
//     imageText?: string,
//     imageTextAudio?: string
//     textInputQuestionOne?: string
//     textInputQuestionOneAudio?: string
//     textInputQuestionTwo?: string
//     textInputQuestionTwoAudio?: string
//     textInputQuestionThree?: string
//     textInputQuestionThreeAudio?: string

//     remarks: string
//     remarksAudio: string
// }