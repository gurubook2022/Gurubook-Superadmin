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
import { Suspense, useEffect, useState } from "react";
import LanguagesSlider from "../languages-slider";
import Option from "../option";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "./image-upload";
import Select from "react-select";
import { dlClasses } from "@/constants/classes";
import DeleteButton from "./delete-button";
import { DlQuestion } from "../../types";
import { chapters } from "@/constants/chapters";
import { Popover } from "@/components/ui/popover";

interface QuestionDetailsProps {
  data: DlQuestion;
}

const QuestionDetails = ({ data }: QuestionDetailsProps) => {
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const [questionDataIndex, setQuestionDataIndex] = useState(
    getLanguageIndex(
      data?.questionData?.map((d) => d.language),
      searchParams.get("lang") || "de"
    )
  );

  useEffect(() => {
    setQuestionDataIndex(
      getLanguageIndex(
        data?.questionData?.map((d) => d.language),
        searchParams.get("lang") || "de"
      )
    );
  }, [data?.questionData, searchParams]);

  const methods = useForm<ImageQuestionInput>({
    resolver: zodResolver(imageQuestionFormSchema),
    defaultValues: {
      points: data?.points,
      questionNumber: data?.questionNumber,
      questionData: data?.questionData,
      classes: data?.classes,
      options: data?.options,
      imageUrl: data?.imageUrl,
      chapters: data?.chapters,
    },
  });

  const onSubmit = async (inputData: ImageQuestionInput) => { };
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
                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data) => data?.language === "en"
                      )?.title
                    }
                    placement="top"
                  >
                    <Input
                      label="Title"
                      placeholder="Title"
                      {...methods.register(
                        `questionData.${questionDataIndex}.title`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.title`
                      )}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          if (
                            methods.watch(
                              `questionData.${questionDataIndex}.titleAudio`
                            )
                          ) {
                            const audio = new Audio();
                            audio.src = methods.watch(
                              `questionData.${questionDataIndex}.titleAudio`
                            );
                            audio.play();
                          }
                        }
                      }}
                      helperClassName="border-4"
                    />
                  </Popover>
                  <Popover
                    size="lg"
                    content={() =>
                      data?.questionData?.find(
                        (data) => data?.language === "en"
                      )?.subTitle
                    }
                    placement="top"
                  >
                    <Input
                      label="Sub Title"
                      placeholder="Sub Title"
                      {...methods.register(
                        `questionData.${questionDataIndex}.subTitle`
                      )}
                      value={methods.watch(
                        `questionData.${questionDataIndex}.subTitle`
                      )}
                      onMouseEnter={(e) => {
                        if (e.isTrusted) {
                          if (
                            methods.watch(
                              `questionData.${questionDataIndex}.subTitleAudio`
                            )
                          ) {
                            const audio = new Audio();
                            audio.src = methods.watch(
                              `questionData.${questionDataIndex}.subTitleAudio`
                            );
                            audio.play();
                          }
                        }
                      }}
                      className="w-56"
                      helperClassName="border-4"
                    />
                  </Popover>
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
                <Popover
                  size="lg"
                  content={() =>
                    data?.questionData?.find((data) => data?.language === "en")
                      ?.remarks
                  }
                  placement="top"
                >
                  <Textarea
                    label="Remarks"
                    placeholder="Remarks"
                    {...methods.register(
                      `questionData.${questionDataIndex}.remarks`
                    )}
                    value={methods.watch(
                      `questionData.${questionDataIndex}.remarks`
                    )}
                    onMouseEnter={(e) => {
                      if (e.isTrusted) {
                        if (
                          methods.watch(
                            `questionData.${questionDataIndex}.remarksAudio`
                          )
                        ) {
                          const audio = new Audio();
                          audio.src = methods.watch(
                            `questionData.${questionDataIndex}.remarksAudio`
                          );
                          audio.play();
                        }
                      }
                    }}
                    helperClassName="border-4"
                    className="!mb-10"
                  />
                </Popover>
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
