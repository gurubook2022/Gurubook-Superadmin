import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLanguageIndex } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Popover } from "@/components/ui/popover";
import { Option as OptionT } from "../types";

interface OptionProps {
  optionDataIndex: number;
  option: OptionT;
}

const Option = ({ optionDataIndex, option }: OptionProps) => {
  const searchParams = useSearchParams();
  const [optionIndex, setOptionIndex] = useState(
    getLanguageIndex(
      option?.optionData?.map((opt) => opt?.language),
      searchParams.get("lang") || "de"
    )
  );

  useEffect(() => {
    setOptionIndex(
      getLanguageIndex(
        option?.optionData?.map((opt) => opt?.language),
        searchParams.get("lang") || "de"
      )
    );
  }, [option?.optionData, searchParams]);
  const { register, watch, setValue, control } = useFormContext();

  const toggleIsCorrect = () => {
    setValue(
      `options.${optionDataIndex}.isCorrect`,
      !watch(`options.${optionDataIndex}.isCorrect`)
    );
  };
  return (
    <div className="relative">
      <Button
        onClick={toggleIsCorrect}
        className="absolute p-0 py-0 h-auto top-5 bg-white -left-1"
      >
        {watch(`options.${optionDataIndex}.isCorrect`) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            fill="none"
          >
            <path
              fill="#6FCF97"
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0ZM8 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            fill="none"
          >
            <path
              fill="#FB5B5B"
              fillRule="evenodd"
              d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Zm13.529 4.472L10 10.942l-3.529 3.53-.942-.943L9.057 10 5.53 6.471l.942-.942 3.53 3.528 3.528-3.528.943.942-3.53 3.53 3.53 3.528-.943.943Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Button>
      <Controller
        control={control}
        name={`options.${optionDataIndex}.optionData.${optionIndex}.content`}
        render={({ field: { onChange } }) => (
          <>
            {/* <QuillEditor
            onChange={onChange}
            value={
              watch(
                `options.${optionDataIndex}.optionData.${optionIndex}.content`
              ) || undefined
            }
            label={`Answer Option ${optionDataIndex + 1}`}
            className="col-span-full mb-10 [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            /> */}
            <Popover
              size="lg"
              content={() =>
                option?.optionData?.find((data) => data?.language === "en")
                  ?.content
              }
              placement="top"
            >
              <Input
                label={`Answer Option ${optionDataIndex + 1}`}
                placeholder="Option Text"
                {...register(
                  `options.${optionDataIndex}.optionData.${optionIndex}.content`
                )}
                value={watch(
                  `options.${optionDataIndex}.optionData.${optionIndex}.content`
                )}
                onChange={(e) => {
                  setValue(
                    `options.${optionDataIndex}.optionData.${optionIndex}.content`, // Field name
                    e.target.value // New value from the input
                  );
                }}
                helperClassName="border-4"
              />
            </Popover>
          </>
        )}
      />
    </div>
  );
};

export default Option;
