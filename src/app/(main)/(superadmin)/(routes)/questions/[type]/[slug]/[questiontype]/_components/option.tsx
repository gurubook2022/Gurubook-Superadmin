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
  onRemove: () => void; // Add this
}

const Option = ({ optionDataIndex, option, onRemove }: OptionProps) => {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "de";


  const [optionIndex, setOptionIndex] = useState(
    getLanguageIndex(
      option?.optionData?.map((opt) => opt?.language),
      searchParams.get("lang") || "de"
    )
  );
  const [showHighlightedWord, setShowHighlightedWord] = useState(false);

  useEffect(() => {
    const newIndex = getLanguageIndex(
      option?.optionData?.map((opt) => opt?.language),
      currentLang
    );
    setOptionIndex(newIndex);
  }, [option?.optionData, currentLang]);


  const { register, watch, setValue, control } = useFormContext();

  const toggleIsCorrect = () => {
    setValue(
      `options.${optionDataIndex}.isCorrect`,
      !watch(`options.${optionDataIndex}.isCorrect`)
    );
  };

  // Get current highlighted word
  const highlightedWordPath = `options.${optionDataIndex}.optionData.${optionIndex}.highlightedWord`;
  const highlightedWord = watch(highlightedWordPath) || "";

  return (
    <div className="relative group" >
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

      {/* Add Delete Button - appears on hover */}
      <Button
        type="button"
        onClick={onRemove} // Use the onRemove prop
        className="absolute text-xs h-auto -top-2 -right-0  opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove this option"
        color="danger"
        size="sm"

      >
        Remove
      </Button>
      <div className="flex flex-col gap-2">
        <Controller
          key={`${optionDataIndex}-${optionIndex}-${currentLang}`} // Force remount on language change
          control={control}
          name={`options.${optionDataIndex}.optionData.${optionIndex}.content`}
          render={({ field: { onChange } }) => (
            <>
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
                      `options.${optionDataIndex}.optionData.${optionIndex}.content`,
                      e.target.value
                    );
                  }}
                  helperClassName="border-4"
                />
              </Popover>
            </>
          )}
        />

        {/* Highlighted Word Section - Only show for correct answers */}
        {watch(`options.${optionDataIndex}.isCorrect`) && (
          <div className="ml-6">
            <button
              type="button"
              onClick={() => setShowHighlightedWord(!showHighlightedWord)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              {showHighlightedWord ? "Hide" : "Show"} Highlighted Word
              {highlightedWord && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                  {highlightedWord}
                </span>
              )}
            </button>

            {showHighlightedWord && (
              <div className="flex flex-col gap-1">
                <Input
                  label=""
                  placeholder="Enter a single keyword (e.g., speed)"
                  value={highlightedWord}
                  onChange={(e) => setValue(highlightedWordPath, e.target.value.trim())}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Option;
