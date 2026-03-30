"use client";
import { cn, getLanguageIndex, getLanguageName } from "@/lib/utils";
import { DlQuestion, Option as OptionT, QuestionData } from "../../types";
import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VideoQuestionInput,
  videoQuestionFormSchema,
} from "@/validators/video-question";
import { Suspense, useEffect, useState } from "react";
import LanguagesSlider from "../languages-slider";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { dlClasses } from "@/constants/classes";
import VideoUpload from "./video-upload";
import DeleteButton from "./delete-button";
import { chapters } from "@/constants/chapters";
import { Popover } from "@/components/ui/popover";
import Option from "../option";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface QuestionDetailsProps {
  data: DlQuestion;
}

const QuestionDetails = ({ data }: QuestionDetailsProps) => {
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "de";
  const [questionDataIndex, setQuestionDataIndex] = useState(
    getLanguageIndex(
      data?.questionData?.map((d: QuestionData) => d.language),
      searchParams.get("lang") || "de"
    )
  );

  useEffect(() => {
    setQuestionDataIndex(
      getLanguageIndex(
        data?.questionData?.map((d: QuestionData) => d.language),
        searchParams.get("lang") || "de"
      )
    );
  }, [data?.questionData, searchParams]);

  const methods = useForm<VideoQuestionInput>({
    resolver: zodResolver(videoQuestionFormSchema),
    defaultValues: {
      points: data?.points,
      questionNumber: data?.questionNumber,
      questionData: data?.questionData,
      classes: data?.classes,
      options: data?.options,
      videoUrl: data?.videoUrl,
      endImageUrl: data?.endImageUrl,
      startImageUrl: data?.startImageUrl,
      chapters: data?.chapters,
    },
  });
  const onSubmit = (inputData: VideoQuestionInput) => { };
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
            onSubmit={methods.handleSubmit(onSubmit)}
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
                            options={dlClasses?.map((item) => ({
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
                            isMulti={true}
                            value={value?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            options={chapters?.map((item) => ({
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

                  <Controller
                    key={`${questionDataIndex}-${currentLang}-title`}
                    control={methods.control}
                    name={`questionData.${questionDataIndex}.title`}
                    render={({ field }) => (
                      <Popover
                        size="lg"
                        content={() =>
                          data?.questionData?.find(
                            (data: QuestionData) => data?.language === "en"
                          )?.title
                        }
                        placement="top"
                      >
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
                      </Popover>
                    )}
                  />

                  <Controller
                    key={`${questionDataIndex}-${currentLang}-subTitle`}
                    control={methods.control}
                    name={`questionData.${questionDataIndex}.subTitle`}
                    render={({ field }) => (

                      <Popover
                        size="lg"
                        content={() =>
                          data?.questionData?.find(
                            (data: QuestionData) => data?.language === "en"
                          )?.subTitle
                        }
                        placement="top"
                      >
                        <Input
                          label="Sub Title"
                          placeholder="Sub Title"
                          {...field}
                          value={field.value ?? ""}
                          onMouseEnter={(e) => {
                            if (e.isTrusted) {
                              const audioUrl = methods.getValues(
                                `questionData.${questionDataIndex}.subTitleAudio`
                              );
                              if (audioUrl) {
                                const audio = new Audio();
                                audio.src = audioUrl;
                                audio.play();
                              }
                            }
                          }}
                          className="w-56"
                          helperClassName="border-4"
                        />
                      </Popover>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <VideoUpload />
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

                <div className="flex flex-col gap-4 !mb-10">
                  <Controller
                    key={`${questionDataIndex}-${currentLang}-remarks`}
                    control={methods.control}
                    name={`questionData.${questionDataIndex}.remarks`}
                    render={({ field }) => <><Popover
                      size="lg"
                      content={() => data?.questionData?.find(
                        (data: any) => data?.language === "en"
                      )?.remarks
                      }
                      placement="top"
                    >
                      <Textarea
                        label="Remarks"
                        placeholder="Remarks"
                        {...field}
                        onMouseEnter={(e) => {
                          if (e.isTrusted) {
                            const audioUrl = methods.getValues(
                              `questionData.${questionDataIndex}.remarksAudio`
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
                    </Popover></>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex px-10 py-4 fixed bottom-0 right-0 backdrop-blur-3xl	 left-0   items-center justify-end gap-6">
              <DeleteButton _id={data?._id} />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default QuestionDetails;
