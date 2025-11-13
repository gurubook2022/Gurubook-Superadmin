"use client";

import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import UploadIcon from "@/components/shape/upload";
import { FieldError } from "@/components/ui/field-error";
import { endsWith } from "lodash";
import {
  Trash2Icon,
  UploadIcon as LucidUploadIcon,
  LoaderIcon,
  FileCheck2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UploadZoneProps {
  label?: string;
  name: string;
  getValues: any;
  setValue: any;
  className?: string;
  error?: string;
  inputType?: "File" | "Image" | "Video";
}

export default function UploadZone({
  label,
  name,
  className,
  getValues,
  setValue,
  error,
  inputType = "Image",
}: UploadZoneProps) {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [file, setFile] = useState<File | null | string>(
    getValues(name) || null
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
  }, []);
  const accept =
    inputType === "Image"
      ? { "image/png": [".png"], "image/jpg": [".jpg"] }
      : inputType === "Video"
        ? { "video/*": [".mp4"] }
        : {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
          ],
        };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // @ts-ignore
    accept,
  });

  const handleRemoveFile = async () => {
    if (typeof file === "string") {
      try {
        setDeleteLoading(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/delete-from-cloudinary`,
          {
            url: file,
          }
        );

        setFile(null);
        if (inputType === "File") {
          setValue(name, null);
        } else {
          setValue(name, "");
        }
      } catch (error) {
        toast.error("Something Went Wrong!", {
          position: "bottom-left",
        });
      } finally {
        setDeleteLoading(false);
      }
    } else {
      setFile(null);
      if (inputType === "File") {
        setValue(name, null);
      } else {
        setValue(name, "");
      }
    }
  };

  const handleUpload = async () => {
    const cloudName = "ddhmnfjrf";
    const uploadPreset = "pexr4wfb";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", uploadPreset);
    setUploadLoading(true);
    try {
      const { data } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setValue(name, data?.url);
    } catch (error) {
      console.error("Upload error:", error);
      // setUploadStatus("error");
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (inputType === "File") {
      setValue(name, file);
    }
  }, [file, inputType, setValue, name]);
  return (
    <div className={cn("grid", className)}>
      {label && (
        <span className="mb-1.5 block font-semibold text-gray-900">
          {label}
        </span>
      )}
      <div
        className={cn(
          "rounded-md border",
          !isEmpty(file) && "flex items-center justify-between pr-6",

          error && "border-red-400"
        )}
      >
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer items-center gap-4 px-6 py-5 transition-all duration-300",
            isEmpty(file) ? "justify-center" : "flex-grow justify-start"
          )}
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-12 w-12" />
          <Text className="text-base font-medium">Drop or select file</Text>
        </div>
        {file && typeof file !== "string" && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2 min-w-fit"
              size="sm"
              // isLoading={isLoading}
              onClick={handleRemoveFile}
            >
              <Trash2Icon className="w-4 h-4" />
              Clear file
            </Button>
            {/* {inputType !== "File" && (
              <Button
                className="gap-2 min-w-fit"
                size="sm"
                //   isLoading={isLoading}
                onClick={handleUpload}
              >
                {uploadLoading ? (
                  <LoaderIcon className="text-white w-4 h-4 animate-spin" />
                ) : (
                  <LucidUploadIcon className="w-4 h-4" />
                )}
                Upload file
              </Button>
            )} */}
          </div>
        )}
      </div>

      {error && <FieldError error={error} />}
      <div className="flex items-center justify-center">
        {file && (
          <figure className="group relative h-64 w-96 rounded-md bg-gray-50">
            {typeof file === "string" && (
              <>
                <MediaPreview
                  name={name.includes(".") ? name : file}
                  url={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file}`}
                />
                <button
                  disabled={deleteLoading}
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
                >
                  {deleteLoading ? (
                    <LoaderIcon className="text-white w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="text-white w-4 h-4" />
                  )}
                </button>
              </>
            )}
            {file instanceof File && (
              <>
                <MediaPreview
                  name={file?.name}
                  url={URL.createObjectURL(file)}
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
                >
                  <Trash2Icon className="text-white w-4 h-4" />
                </button>
              </>
            )}
          </figure>
        )}
      </div>
    </div>
  );
}

function MediaPreview({ name, url }: { name: string; url: string }) {
  const isPdf = endsWith(name, ".pdf");
  const isVideo = endsWith(name, ".mp4");
  const isImage = endsWith(name, ".png") || endsWith(name, ".jpg");
  const isXlsx = endsWith(name, ".xlsx");
  return (
    <>
      {isXlsx && (
        // <object data={url} width={"100%"} height={"100%"}>
        <div className="flex items-center flex-col w-full h-full justify-center ">
          <FileCheck2 className="w-32 h-32 " />
          <p>{name}</p>
        </div>
        // </object>
      )}
      {isPdf && (
        <object data={url} type="application/pdf" width="100%" height="100%">
          <p>
            Alternative text - include a link <a href={url}>to the PDF!</a>
          </p>
        </object>
      )}
      {isVideo && (
        <video
          controls
          className="w-full h-full transform rounded-md object-contain"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {isImage && (
        <Image
          fill
          src={url}
          alt={name}
          className="transform rounded-md object-contain"
        />
      )}
    </>
  );
}

export function LoadingSpinner() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
          <stop stopColor="#fff" stopOpacity="0" offset="0%" />
          <stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
          <stop stopColor="#fff" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)">
          <path
            d="M36 18c0-9.94-8.06-18-18-18"
            id="Oval-2"
            stroke="url(#a)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
          <circle fill="#fff" cx="36" cy="18" r="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}
