import { z } from "zod";

export const bkfNumericalQuestionFormSchema = z.object({
    points: z.coerce.number().nonnegative({ message: "Points should be ≥ 0" }),
    questionNumber: z.string().min(1, { message: "Question number is required" }),
    questionData: z.array(z.object({
        _id: z.string(),
        language: z.string().min(1, { message: "Language is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        titleAudio: z.string(),
        subTitle: z.string().optional(),
        subTitleAudio: z.string().optional(),
        remarks: z.string().optional(),
        remarksAudio: z.string().optional(),
        textInputQuestionOne: z.string().optional(),
        textInputQuestionOneAudio: z.string().optional(),
        textInputQuestionTwo: z.string().optional(),
        textInputQuestionTwoAudio: z.string().optional(),
        textInputQuestionThree: z.string().optional(),
        textInputQuestionThreeAudio: z.string().optional(),
    })).optional(),
    solution: z.string().optional(),
    solution1: z.string().optional(),
    classes: z.array(z.string()).nonempty({ message: "Atleast one class is required" }),
    chapters: z.array(z.string()).nonempty({ message: "Atleast one chapter is required" }),
});

export type BkfNumericalQuestionInput = z.infer<
    typeof bkfNumericalQuestionFormSchema
>;
