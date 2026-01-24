import { z } from "zod";

export const videoQuestionFormSchema = z.object({
    points: z.coerce.number().nonnegative({ message: "Points should be ≥ 0" }),
    questionNumber: z.string().optional(),
    questionData: z.array(z.object({
        language: z.string(),
        title: z.string(),
        titleAudio: z.string(),
        subTitle: z.string().optional(),
        subTitleAudio: z.string(),
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
            content: z.string().min(1, { message: "Content is required" }),
            audio: z.string().optional(),
            highlightedWord: z.string().optional()
        })),
    })).min(1, { message: "Options are required" }),
    videoUrl: z.string().min(1, { message: "Video is required" }),
    startImageUrl: z.string().min(1, { message: "Start Image is required" }),
    endImageUrl: z.string().min(1, { message: "End Image is required" })
});

export type VideoQuestionInput = z.infer<typeof videoQuestionFormSchema>;
