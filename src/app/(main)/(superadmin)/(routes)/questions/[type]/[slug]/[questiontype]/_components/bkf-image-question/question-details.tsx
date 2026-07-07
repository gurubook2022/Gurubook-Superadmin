"use client";
import { cn, getLanguageIndex, getLanguageName } from "@/lib/utils";
import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BkfImageQuestionInput,
  bkfImageQuestionFormSchema,
} from "@/validators/bkf-image-question";
import { Suspense, useEffect, useMemo, useState } from "react";
import LanguagesSlider from "../languages-slider";
import Option from "../option";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "./image-upload";
import Select from "react-select";
import { bkfClasses } from "@/constants/classes";
import DeleteButton from "./delete-button";
import { BKFQuestion, Option as OptionT, } from "../../types";
import { bkfChapters } from "@/constants/chapters";
import { Popover } from "@/components/ui/popover";
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

  const [updateBkfQuestion, { loading: updateLoading }] =
    useMutation(UPDATE_BKF_QUESTION);


  // Transform data to ensure all fields exist with proper defaults
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
      // remarksAudio: qd?.remarksAudio ?? "",
    })) ?? [],
    classes: data?.classes ?? [],
    chapters: data?.chapters ?? [],
    options: data?.options?.map((opt: any) => ({
      _id: opt?._id ?? "",
      isCorrect: opt?.isCorrect ?? false,
      optionData: opt?.optionData?.map((od: any) => ({
        _id: od?._id ?? "",
        language: od?.language ?? "",
        content: od?.content ?? "",
        audio: od?.audio ?? "",
        highlightedWord: od?.highlightedWord ?? "",
      })) ?? [],
    })) ?? [],
    imageUrl: data?.imageUrl ?? "",
  }), [data]);

  const methods = useForm<BkfImageQuestionInput>({
    resolver: zodResolver(bkfImageQuestionFormSchema),
    defaultValues
  });
  const { refresh } = useRouter()


  // Reset form when data changes (e.g., after save or when navigating to different question)
  useEffect(() => {
    if (data?._id) {
      methods.reset(defaultValues);
    }
  }, [data?._id]); // Only reset when the question ID changes, not on every data change

  const onSubmit = async (inputData: BkfImageQuestionInput) => {
    await updateBkfQuestion({
      variables: {
        _id: data?._id,
        points: inputData?.points,
        questionNumber: inputData?.questionNumber,
        classes: inputData?.classes,
        options: inputData?.options,
        questionData: inputData?.questionData,
        chapters: inputData?.chapters,
        questionType: "Bkf Image"
      },
      onCompleted: ({ updateBkfQuestion }) => {
        if (updateBkfQuestion === data?._id) {
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
  // Add these handler functions before the return statement, after onSubmit
  const addOption = () => {
    const currentOptions = methods.getValues('options') || [];

    // Create new option with data for all languages
    const languages = data?.questionData?.map(qd => qd.language) || ['de'];
    const newOption: OptionT = {
      isCorrect: false,
      optionData: languages.map(lang => ({
        language: lang,
        content: '',
        audio: '',
        highlightedWord: ''
      }))
    };

    methods.setValue('options', [...currentOptions, newOption]);
  };

  const removeOption = (index: number) => {
    const currentOptions = methods.getValues('options') || [];
    if (currentOptions.length <= 1) {
      toast.error("At least one option is required", {
        position: "bottom-left",
      });
      return;
    }

    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    methods.setValue('options', updatedOptions);
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
                if (errors.options) {
                  const optionErrors = errors.options;
                  const formOptions = methods.getValues("options") || [];
                  if (Array.isArray(optionErrors)) {
                    optionErrors.forEach((optErr, i) => {
                      if (optErr?.optionData) {
                        const optionDataErrors = optErr.optionData as any[];
                        if (Array.isArray(optionDataErrors)) {
                          optionDataErrors.forEach((odErr, j) => {
                            if (odErr?.content) {
                              const langCode = formOptions[i]?.optionData?.[j]?.language;
                              const langName = langCode ? getLanguageName(langCode) || langCode : "unknown";
                              messages.push(`Answer Option ${i + 1} (${langName}): Content is required`);
                            }
                          });
                        }
                      }
                    });
                  }
                }
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
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
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
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
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
                <div className="flex flex-col gap-4">
                  <ImageUpload />
                </div>

                <div className="flex flex-col gap-4">
                  {methods.watch('options')?.map((optionData: OptionT, optionDataIndex) => (
                    <Option
                      key={optionData._id}
                      optionDataIndex={optionDataIndex}
                      option={optionData}
                      onRemove={() => removeOption(optionDataIndex)}
                    />
                  ))}
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      onClick={addOption}
                      variant="solid"
                      color="primary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Option
                    </Button>
                  </div>
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
