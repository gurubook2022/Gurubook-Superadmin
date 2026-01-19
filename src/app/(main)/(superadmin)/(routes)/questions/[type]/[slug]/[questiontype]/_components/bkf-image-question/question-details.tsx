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
import { BKFQuestion } from "../../types";
import { Tooltip } from "@/components/ui/tooltip";
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
      remarksAudio: qd?.remarksAudio ?? "",
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
        questionType: "Bkf Solo"
      },
      onCompleted: ({ updateBkfQuestion }) => {
        if (updateBkfQuestion === data?._id) {
          toast.success("Question Updated Successfully", {
            position: "bottom-left",
          });
          // toast.dismiss(toastId);
          refresh();
        }
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
                <div className="flex flex-col gap-4 !mb-10">
                  {data?.options?.map((optionData, optionDataIndex) => (
                    <Option
                      key={optionData._id}
                      optionDataIndex={optionDataIndex}
                      option={optionData}
                    />
                  ))}
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
