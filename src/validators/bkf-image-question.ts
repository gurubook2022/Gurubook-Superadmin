import { z } from "zod";

export const bkfImageQuestionFormSchema = z.object({
    points: z.coerce.number().nonnegative({ message: "Points should be ≥ 0" }),
    questionNumber: z.string().min(1, { message: "Question number is required" }),
    questionData: z.array(z.object({
        _id: z.string().optional(),
        language: z.string().min(1, { message: "Language is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        titleAudio: z.string(),
        remarks: z.string(),
        remarksAudio: z.string(),
    })).optional(),
    classes: z.array(z.string()).nonempty({ message: "Atleast one class is required" }),
    chapters: z.array(z.string()).nonempty({ message: "Atleast one chapter is required" }),
    options: z.array(z.object({
        _id: z.string().optional(),
        isCorrect: z.boolean(),
        optionData: z.array(z.object({
            _id: z.string().optional(),
            language: z.string(),
            content: z.string(),
            audio: z.string(),
            highlightedWord: z.string().optional()
        })),
    })).nonempty({ message: "Options are required" }),
    // imageUrl: z.string().min(1, { message: "Image is requried" })
    imageUrl: z.string().optional()
});

export type BkfImageQuestionInput = z.infer<typeof bkfImageQuestionFormSchema>;
