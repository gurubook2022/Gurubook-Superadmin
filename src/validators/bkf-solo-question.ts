import { z } from "zod";

export const bkfSoloQuestionFormSchema = z.object({
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
        remarksAudio: z.string().optional()
    })).optional(),
    classes: z.array(z.string()).nonempty({ message: "Atleast one class is required" }),
    chapters: z.array(z.string()).nonempty({ message: "Atleast one chapter is required" }),
    options: z.array(z.object({
        _id: z.string().optional(),
        isCorrect: z.boolean(),
        optionData: z.array(z.object({
            _id: z.string().optional(),
            language: z.string(),
            content: z.string().optional(),
            audio: z.string().optional()
        })),
    })).nonempty({ message: "Options are required" }),
});

export type BkfSoloQuestionInput = z.infer<typeof bkfSoloQuestionFormSchema>;
