import { z } from "zod";

export const soloQuestionFormSchema = z.object({
    points: z.coerce.number().nonnegative({ message: "Points should be ≥ 0" }),
    questionNumber: z.string().min(1, { message: "Question number is required" }),
    questionData: z.array(z.object({
        _id: z.string().optional(),
        language: z.string(),
        title: z.string().min(1, { message: "Title is required" }),
        titleAudio: z.string().optional(),
        subTitle: z.string().optional(),
        subTitleAudio: z.string().optional(),
        remarks: z.string().optional(),
        remarksAudio: z.string().optional()
    })),
    classes: z.array(z.string()).min(1, { message: "At least one class is required" }),
    chapters: z.array(z.string()).min(1, { message: "At least one chapter is required" }),
    options: z.array(z.object({
        _id: z.string().optional(),
        isCorrect: z.boolean(),
        optionData: z.array(z.object({
            _id: z.string().optional(),
            language: z.string(),
            content: z.string().min(1, { message: "Content is required" }),
            audio: z.string().optional(),
            highlightedWord: z.string().optional()
        })),
    })).min(1, { message: "Options are required" }),
});

export type SoloQuestionInput = z.infer<typeof soloQuestionFormSchema>;