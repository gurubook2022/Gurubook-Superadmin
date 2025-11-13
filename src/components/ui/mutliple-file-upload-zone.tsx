"use client";

import isEmpty from "lodash/isEmpty";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import UploadIcon from "@/components/shape/upload";
import { FieldError } from "@/components/ui/field-error";
import { endsWith } from "lodash";
import { Trash2Icon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";

interface UploadZoneProps {
  label?: string;
  name: string;
  className?: string;
  error?: string;
}

export default function MultiFileUploadZone({
  label,
  name,
  className,
  error,
}: UploadZoneProps) {
  const { setValue, control } = useFormContext();
  const files: File[] = useWatch({ control, name }) || [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Append new files to existing ones
      setValue(name, [...files, ...acceptedFiles], { shouldValidate: true });
    },
    [files, name, setValue]
  );

  const accept = {
    "image/png": [".png"],
    "image/jpg": [".jpg"],
    "video/*": [".mp4"],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files.slice(0, index), ...files.slice(index + 1)];
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  const handleClearAll = () => setValue(name, [], { shouldValidate: true });

  return (
    <div className={cn("grid space-y-2", className)}>
      {label && (
        <span className="mb-1.5 block font-semibold text-gray-900">{label}</span>
      )}

      <div
        className={cn(
          "rounded-md border",
          !isEmpty(files) && "flex items-center justify-between pr-6"
        )}
      >
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer items-center gap-4 px-6 py-5 transition-all duration-300",
            isEmpty(files) ? "justify-center" : "flex-grow justify-start"
          )}
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-12 w-12" />
          <Text className="text-base font-medium">Drop or select file</Text>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2 min-w-fit"
              size="sm"
              onClick={handleClearAll}
            >
              <Trash2Icon className="w-4 h-4" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {error && <FieldError error={error} />}

      <div className="flex items-center justify-center flex-wrap gap-y-6 gap-x-10">
        {files.map((file, index) => (
          <figure
            key={index}
            className="group relative h-64 w-96 rounded-md bg-gray-50"
          >
            <MediaPreview name={file.name} url={URL.createObjectURL(file)} />
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
            >
              <Trash2Icon className="text-white w-4 h-4" />
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}

function MediaPreview({ name, url }: { name: string; url: string }) {
  const isPdf = endsWith(name, ".pdf");
  const isVideo = endsWith(name, ".mp4");
  const isImage = endsWith(name, ".png") || endsWith(name, ".jpg");
  return (
    <>
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
          className="w-full h-full transform rounded-md object-cover"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {isImage && (
        <img
          src={url}
          alt={name}
          className="transform rounded-md w-full h-full object-cover"
        />
      )}
    </>
  );
}
