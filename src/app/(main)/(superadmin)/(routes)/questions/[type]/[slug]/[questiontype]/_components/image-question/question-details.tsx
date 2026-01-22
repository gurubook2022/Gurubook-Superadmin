"use client";
import { cn, getLanguageIndex, getLanguageName } from "@/lib/utils";
import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImageQuestionInput,
  imageQuestionFormSchema,
} from "@/validators/image-question";
import { Suspense, useEffect, useMemo, useState } from "react";
import LanguagesSlider from "../languages-slider";
import Option from "../option";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "./image-upload";
import Select from "react-select";
import { dlClasses } from "@/constants/classes";
import DeleteButton from "./delete-button";
import { DlQuestion, QuestionData } from "../../types";
import { chapters } from "@/constants/chapters";
import { Popover } from "@/components/ui/popover";
import { UPDATE_IMAGE_QUESTION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

interface QuestionDetailsProps {
  data: DlQuestion;
}

const QuestionDetails = ({ data }: QuestionDetailsProps) => {
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "de";

  const [updateImageQuestion, { loading: updateLoading }] =
    useMutation(UPDATE_IMAGE_QUESTION);

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
      remarksAudio: qd?.remarksAudio ?? "",
      imageText: qd?.imageText ?? "",
      imageTextAudio: qd?.imageTextAudio ?? "",
    })) ?? [],
    classes: data?.classes ?? [],
    chapters: data?.chapters ?? [],
    imageUrl: data?.imageUrl ?? "",

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
  }), [data]);




  const questionDataIndex = useMemo(() =>
    getLanguageIndex(
      data?.questionData?.map((d) => d.language),
      searchParams.get("lang") || "de"
    ) || 0
    , [data?.questionData, searchParams]);


  const methods = useForm<ImageQuestionInput>({
    resolver: zodResolver(imageQuestionFormSchema),
    defaultValues
  });

  // Reset form when data changes (e.g., after save or when navigating to different question)
  useEffect(() => {
    if (data?._id) {
      methods.reset(defaultValues);
    }
  }, [data?._id]); // Only reset when the question ID changes, not on every data change

  const onSubmit = async (inputData: ImageQuestionInput) => {
    try {
      const result = await updateImageQuestion({
        variables: {
          _id: data?._id,
          points: inputData?.points,
          questionNumber: inputData?.questionNumber,
          classes: inputData?.classes,
          options: inputData?.options,
          questionData: inputData?.questionData,
          chapters: inputData?.chapters,
          imageUrl: inputData?.imageUrl,
        },
      });

      if (result.data?.updateDlQuestion === data?._id) {
        toast.success("Question Updated Successfully", {
          position: "bottom-left",
        });
        refresh();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update question", {
        position: "bottom-left",
      });
    }
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
                  <ImageUpload />
                  <div className="flex items-center justify-center">
                    <Input
                      label="Image Text"
                      placeholder="Image Text"
                      {...methods.register(
                        `questionData.${questionDataIndex}.imageText`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.imageText`
                      )}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          if (
                            methods.watch(
                              `questionData.${questionDataIndex}.imageTextAudio`
                            )
                          ) {
                            const audio = new Audio();
                            audio.src = methods.watch(
                              `questionData.${questionDataIndex}.imageTextAudio`
                            );
                            audio.play();
                          }
                        }
                      }}
                      className="w-56"
                      helperClassName="border-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {data?.options?.map((optionData, optionDataIndex) => (
                    <Option
                      key={optionData._id}
                      optionDataIndex={optionDataIndex}
                      option={optionData}
                    />
                  ))}
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
