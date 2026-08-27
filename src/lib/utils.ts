import { ApolloError } from "@apollo/client";
import toast from "react-hot-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LANGUAGES } from "@/constants/languages";
import axios from "axios";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function rangeMap(n: number, fn: (i: number) => any) {
  const arr = [];
  while (n > arr.length) {
    arr.push(fn(arr.length));
  }
  return arr;
}

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function handleGraphqlErrors(error: ApolloError) {
  const { networkError, clientErrors, graphQLErrors, protocolErrors } = error

  if (networkError) {
    // @ts-ignore
    if (error?.networkError?.result) {
      // @ts-ignore
      error?.networkError?.result?.errors?.forEach((error) => {
        toast.error(error?.message, {
          position: "bottom-left"
        })
      })
      return
    }
    toast.error("Something Went Wrong!", {
      position: "bottom-left"
    })
    return;
  }

  if (graphQLErrors) {
    if (graphQLErrors?.length > 0) {
      graphQLErrors?.forEach((error) => {
        if (error.message.startsWith("Variable")) {
          const variable = error.message.split(" ")[1]
          const variableWithQutations = variable.substring(2, variable.length - 1)
          toast.error(`${capitalizeFirstLetter(variableWithQutations)} is required`, {
            position: "bottom-left"
          })
        } else {
          toast.error(error.message, {
            position: "bottom-left"
          })
        }
      })
      return;
    }

    toast.error("Something Went Wrong!", {
      position: "bottom-left"
    })
    return;
  }


  toast.error("Something worng", {
    position: "bottom-left"
  })
}

export const toFixed = (num: number) => parseFloat(num.toFixed(2).replace(/0+$/, ""))

export const getLanguageIndex = (LANGUAGES: string[], selectedLanguageCode: string) => {
  const index = LANGUAGES?.findIndex(lang => lang === selectedLanguageCode)
  return index === -1 ? 0 : index
}

export const getLanguageName = (selectedLanguageCode: string) => {
  const selectedLanguage = LANGUAGES?.find((lang) => lang.code === selectedLanguageCode)

  return selectedLanguage?.title
}

// Matches the audio key convention used by the TTS pipeline: audios/{questionNumber}-{field}-{lang}.mp3
export const buildAudioFileName = (questionNumber: string, field: string, lang: string) => {
  return `${questionNumber}-${field}-${lang}`
}

export const removeExtension = (filename: string) => {
  const parts = filename.split('.');

  const nameWithoutExtension = parts.slice(0, -1).join('.');

  return nameWithoutExtension;
}


export const removeStartAndEnd = (filename: string) => {
  // const parts = filename.split('.');

  // const nameWithoutExtension = parts.slice(0, -1).join('.');
  if (filename.endsWith('_start')) {
    return filename.slice(0, -6);
  }
  if (filename.endsWith('_end')) {
    return filename.slice(0, -4);
  }

  return filename;
}

export const getFileExtension = (filename: string) => {
  const parts = filename.split('.');

  const extension = parts[parts.length - 1];

  return extension;
}

export function addSpacesToCamelCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}


/**
 * Formats a number to a string representation with support for million (M) and billion (B) abbreviations.
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export function formatNumber(value: number): string {
  // Check if the value is less than 0
  if (value < 0) {
    // Handle negative values separately and format the absolute value
    const absoluteValue = Math.abs(value);
    return `-${formatNumber(absoluteValue)}`;
  } else if (value >= 1e9) {
    // Format the value in billions
    const formattedValue = value / 1e9;
    return `${formattedValue.toFixed(1)}B`;
  } else if (value >= 1e6) {
    // Check if the value is between 1 million and 1 billion
    // Format the value in millions
    const formattedValue = value / 1e6;
    return `${formattedValue.toFixed(1)}M`;
  } else if (value >= 1000) {
    // Check if the value is between 1 thousand and 1 million
    // Format the value in thousands
    const formattedValue = value / 1000;
    return `${formattedValue.toFixed(1)}K`;
  } else {
    // If the value is less than 1 thousand, return the original value as a string
    return value.toString();
  }
}


export const serverErrorHandler = (error: Error | unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      redirect("/sign-out")
      return;
    }
    return error;
  } else {
    return error
  }
}

// Utility function to chunk the array into groups of 20
export const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getS3FileUrl = (key: string) =>
  `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
