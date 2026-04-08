"use client";
import { cn, getLanguageIndex, getLanguageName } from "@/lib/utils";
import { BKFQuestion } from "../../types";
import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import LanguagesSlider from "../languages-slider";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BkfNumericalQuestionInput,
  bkfNumericalQuestionFormSchema,
} from "@/validators/bkf-numerical-question";
import { bkfClasses } from "@/constants/classes";
import DeleteButton from "./delete-button";
import ImageUpload from "./image-upload";
import { Popover } from "@/components/ui/popover";
import { bkfChapters } from "@/constants/chapters";
import { UPDATE_BKF_QUESTION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface QuestionDetailsProps {
  data: BKFQuestion;
}

const QuestionDetails = ({ data }: QuestionDetailsProps) => {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "de";

  const [questionDataIndex, setQuestionDataIndex] = useState(
    getLanguageIndex(
      data?.questionData?.map((d) => d.language),
      currentLang
    )
  );

  useEffect(() => {
    setQuestionDataIndex(
      getLanguageIndex(
        data?.questionData?.map((d) => d.language),
        currentLang
      )
    );
  }, [data?.questionData, currentLang]);

  const defaultValues = useMemo(() => ({
    points: data?.points ?? 0,
    questionNumber: data?.questionNumber ?? "",
    questionData: data?.questionData?.map((qd: any) => ({
      _id: qd?._id ?? "",
      language: qd?.language ?? "",
      title: qd?.title ?? "",
      titleAudio: qd?.titleAudio ?? "",
      subTitle: qd?.subTitle ?? "",
      subTitleAudio: qd?.subTitleAudio ?? "",
      remarks: qd?.remarks ?? "",
      remarksAudio: qd?.remarksAudio ?? "",
      imageText: qd?.imageText ?? "",
      imageTextAudio: qd?.imageTextAudio ?? "",
      textInputQuestionOne: qd?.textInputQuestionOne ?? "",
      textInputQuestionOneAudio: qd?.textInputQuestionOneAudio ?? "",
      textInputQuestionTwo: qd?.textInputQuestionTwo ?? "",
      textInputQuestionTwoAudio: qd?.textInputQuestionTwoAudio ?? "",
      textInputQuestionThree: qd?.textInputQuestionThree ?? "",
      textInputQuestionThreeAudio: qd?.textInputQuestionThreeAudio ?? "",
    })) ?? [],
    classes: data?.classes ?? [],
    chapters: data?.chapters ?? [],
    solution: data?.solution ?? "",
    solution1: data?.solution1 ?? "",
    imageUrl: data?.imageUrl ?? "",
  }), [data]);



  const methods = useForm<BkfNumericalQuestionInput>({
    resolver: zodResolver(bkfNumericalQuestionFormSchema),
    defaultValues
  });


  const [updateBkfQuestion, { loading: updateLoading }] =
    useMutation(UPDATE_BKF_QUESTION);

  const { refresh } = useRouter()

  const onSubmit = async (inputData: BkfNumericalQuestionInput) => {
    await updateBkfQuestion({
      variables: {
        _id: data?._id,
        points: inputData?.points,
        questionNumber: inputData?.questionNumber,
        classes: inputData?.classes,
        questionData: inputData?.questionData,
        chapters: inputData?.chapters,
        solution: inputData?.solution,
        solution1: inputData?.solution1,
        questionType: "Bkf Numerical"
      },
      onCompleted: ({ updateBkfQuestion }) => {
        if (updateBkfQuestion) {
          toast.success("Question Updated Successfully", {
            position: "bottom-left",
          });
          refresh();
        }
      },
      onError: () => {
        toast.error("Failed to update question", {
          position: "bottom-left",
        });
      },
    });
  };
  return (
    <div className="space-y-8">
      <Suspense fallback={<>loading ...</>}>
        <LanguagesSlider />
      </Suspense>
      <div>
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              methods.handleSubmit(onSubmit, (errors) => {
                console.log("Validation errors:", errors);
                const messages: string[] = [];
                if (errors.questionNumber) messages.push("Question number is required");
                if (errors.points) messages.push("Points must be valid");
                if (errors.classes) messages.push("At least one class is required");
                if (errors.chapters) messages.push("At least one chapter is required");
                if (errors.questionData) {
                  const qdErrors = errors.questionData;
                  if (Array.isArray(qdErrors)) {
                    const formQd = methods.getValues("questionData") || [];
                    qdErrors.forEach((qdErr, i) => {
                      if (qdErr?.title) {
                        const langCode = formQd[i]?.language;
                        const langName = langCode ? getLanguageName(langCode) || langCode : "unknown";
                        messages.push(`Title (${langName}): ${qdErr.title.message || "is required"}`);
                      }
                    });
                  }
                }
                if ((errors as any).solution) messages.push("Solution is required");
                toast.error(messages.join("\n") || "Please fix the validation errors", {
                  position: "bottom-left",
                  duration: 5000,
                });
              })(e);
            }}
            className={cn("[&_label.block>span]:font-medium space-y-6")}
          >
            <div className="grid md:grid-cols-4 pb-6 border-b border-dashed border-gray-200 gap-10">
              <div>
                <Title>
                  {getLanguageName(searchParams.get("lang") || "de")}
                </Title>
                <Text>
                  Question Details in{" "}
                  {getLanguageName(searchParams.get("lang") || "de")} (
                  {searchParams.get("lang") || "de"})
                </Text>
              </div>
              <div className="md:col-span-3 space-y-4">
                <div className="flex md:flex-row flex-col items-center gap-4 justify-between">
                  <div className="w-full md:w-auto">
                    <Input
                      label="Question Number"
                      disabled
                      placeholder="Question number"
                      {...methods.register(`questionNumber`)}
                      error={methods.formState.errors.questionNumber?.message}
                      helperClassName="border-4"
                    />
                  </div>
                  <div className="mx-auto w-full ">
                    <label
                      className={cn(
                        "mb-1.5 block font-medium text-gray-700 dark:text-gray-600"
                      )}
                    >
                      Classes
                    </label>
                    <Controller
                      control={methods.control}
                      name={`classes`}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <Select
                            className="outline-gray-700 accent-current focus:outline-none focus:border-0  w-full"
                            isMulti={true}
                            value={value?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            options={bkfClasses?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            onChange={(selectItem) => {
                              onChange(selectItem?.map((item) => item.value));
                            }}
                          />
                          {methods?.formState?.errors?.classes?.message && (
                            <p className="text-red text-xs mt-0.5 rizzui-input-error-text">
                              {methods?.formState?.errors?.classes?.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center flex-col md:flex-row gap-4 justify-between">
                  <div className="mx-auto w-full ">
                    <label
                      className={cn(
                        "mb-1.5 block font-medium text-gray-700 dark:text-gray-600"
                      )}
                    >
                      Chapters
                    </label>
                    <Controller
                      control={methods.control}
                      name={`chapters`}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <Select
                            className="outline-gray-700 accent-current focus:outline-none focus:border-0  w-full"
                            isMulti={false}
                            value={value?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            options={bkfChapters?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            onChange={(selectItem) => {
                              onChange([selectItem?.value]);
                            }}
                          />
                          {methods?.formState?.errors?.classes?.message && (
                            <p className="text-red text-xs mt-0.5 rizzui-input-error-text">
                              {methods?.formState?.errors?.classes?.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <Input
                      label="Points"
                      placeholder="Points"
                      {...methods.register(`points`)}
                      error={methods.formState.errors.points?.message}
                      type="number"
                      helperClassName="border-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">

                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data: any) => data?.language === "en"
                      )?.title
                    }
                    placement="top"
                  >
                    <Controller
                      key={`${questionDataIndex}-${currentLang}`}
                      control={methods.control}
                      name={`questionData.${questionDataIndex}.title`}
                      render={({ field }) => (
                        <Input
                          label="Title"
                          placeholder="Title"
                          {...field}
                          onMouseEnter={(e) => {
                            if (e.isTrusted) {
                              const audioUrl = methods.getValues(
                                `questionData.${questionDataIndex}.titleAudio`
                              );
                              if (audioUrl) {
                                const audio = new Audio();
                                audio.src = audioUrl;
                                audio.play();
                              }
                            }
                          }}
                          helperClassName="border-4"
                        />
                      )}
                    />
                  </Popover>
                </div>

                <div className="flex gap-4 items-center !mb-10">
                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data) => data?.language === "en"
                      )?.textInputQuestionOne
                    }
                    placement="top"
                  >
                    <Input
                      label="Text Input Question One"
                      placeholder="Text Input Question One"
                      {...methods.register(
                        `questionData.${questionDataIndex}.textInputQuestionOne`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.textInputQuestionOne`
                      )}

                      onChange={(e) => {
                        methods.setValue(
                          `questionData.${questionDataIndex}.textInputQuestionOne`, // Field name
                          e.target.value // New value from the input
                        );
                      }}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          const audioSrc = methods.watch(
                            `questionData.${questionDataIndex}.textInputQuestionOneAudio`
                          )
                          if (audioSrc) {
                            const audio = new Audio();
                            audio.src = audioSrc
                            audio.play();
                          }
                        }
                      }}
                      className="w-full"
                      helperClassName="border-4"
                    />
                  </Popover>
                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data) => data?.language === "en"
                      )?.textInputQuestionTwo
                    }
                    placement="top"
                  >
                    <Input
                      label="Text Input Question Two"
                      placeholder="Text Input Question Two"
                      {...methods.register(
                        `questionData.${questionDataIndex}.textInputQuestionTwo`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.textInputQuestionTwo`
                      )}

                      onChange={(e) => {
                        methods.setValue(
                          `questionData.${questionDataIndex}.textInputQuestionTwo`, // Field name
                          e.target.value // New value from the input
                        );
                      }}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          const audioSrc = methods.watch(
                            `questionData.${questionDataIndex}.textInputQuestionTwoAudio`
                          )
                          if (
                            audioSrc
                          ) {
                            const audio = new Audio();
                            audio.src = audioSrc
                            audio.play();
                          }
                        }
                      }}
                      className="w-full"
                      helperClassName="border-4"
                    />
                  </Popover>
                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data) => data?.language === "en"
                      )?.textInputQuestionThree
                    }
                    placement="top"
                  >
                    <Input
                      label="Text Input Question Three"
                      placeholder="Text Input Question Three"
                      {...methods.register(
                        `questionData.${questionDataIndex}.textInputQuestionThree`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.textInputQuestionThree`
                      )}

                      onChange={(e) => {
                        methods.setValue(
                          `questionData.${questionDataIndex}.textInputQuestionThree`, // Field name
                          e.target.value // New value from the input
                        );
                      }}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          const audioSrc = methods.watch(`questionData.${questionDataIndex}.textInputQuestionThreeAudio`)
                          if (audioSrc) {
                            const audio = new Audio();
                            audio.src = audioSrc
                            audio.play();
                          }
                        }
                      }}
                      className="w-full"
                      helperClassName="border-4"
                    />
                  </Popover>
                </div>
              </div>
            </div>
            <div className="flex px-10 py-4 fixed bottom-0 right-0 backdrop-blur-3xl	 left-0   items-center justify-end gap-6">
              <DeleteButton _id={data?._id} />
              <Button
                isLoading={updateLoading}
                disabled={updateLoading}
                variant="solid"
                color="primary"
                type="submit"
              >
                Update
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default QuestionDetails;
