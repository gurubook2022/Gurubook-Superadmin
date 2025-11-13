import { z } from "zod";

export const numericalQuestionFormSchema = z.object({
  points: z.coerce.number().nonnegative({ message: "Points should be ≥ 0" }),
  questionNumber: z.string().min(1, { message: "Question number is required" }),
  questionData: z
    .array(
      z.object({
        _id: z.string().min(1, { message: "_id is required" }),
        language: z.string().min(1, { message: "Language is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        titleAudio: z.string(),
        subTitle: z.string(),
        subTitleAudio: z.string(),
        remarks: z.string().optional().nullable(),
        remarksAudio: z.string(),
        textInputQuestionOne: z.string().optional(),
        textInputQuestionOneAudio: z.string(),
        textInputQuestionTwo: z.string().optional(),
        textInputQuestionTwoAudio: z.string(),
        textInputQuestionThree: z.string().optional(),
        textInputQuestionThreeAudio: z.string(),
        imageText: z.string().optional(),
        imageTextAudio: z.string(),
      })
    )
    .optional(),

  classes: z
    .array(z.string())
    .nonempty({ message: "Atleast one class is required" }),
  chapters: z
    .array(z.string())
    .nonempty({ message: "Atleast one chapter is required" }),
  imageUrl: z.string().optional(),
});

export type NumericalQuestionInput = z.infer<
  typeof numericalQuestionFormSchema
>;
