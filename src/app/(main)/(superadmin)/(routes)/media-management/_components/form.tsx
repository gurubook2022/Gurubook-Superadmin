"use client";

import {
  chunkArray,
  cn,
  getFileExtension,
  handleGraphqlErrors,
  removeExtension,
  removeStartAndEnd,
  sleep,
} from "@/lib/utils";
import {
  MediaManagementInput,
  mediaManagementFormSchema,
} from "@/validators/media-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import FilesUpload from "./files-upload";
import { Button } from "@/components/ui/button";
import { UPLOAD_ASSETS } from "@/graphql/mutations";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import uploadFileToAWSS3Bucket from "@/lib/aws-sdk";

const Form = () => {
  const [uploadAssets] = useMutation(UPLOAD_ASSETS);

  const [loading, setLoading] = useState(false);
  const methods = useForm<MediaManagementInput>({
    resolver: zodResolver(mediaManagementFormSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = async (data: MediaManagementInput) => {
    const { files } = data;
    if (!files || files.length === 0) return;

    setLoading(true);


    const fileChunks = chunkArray(files, 5);
    let uploadedCount = 0; // track how many files uploaded

    try {
      // Process each chunk sequentially
      // @ts-ignore
      for (const [chunkIndex, chunk] of fileChunks.entries()) {
        await Promise.all(
          // @ts-ignore
          chunk.map(async (file) => {
            const questionType =
              getFileExtension((file as File)?.name) === "mp4"
                ? "DLVideo"
                : "DLImage";

            try {
              const url = await uploadFileToAWSS3Bucket(
                file as File,
                questionType === "DLImage" ? "image" : "video"
              );

              await uploadAssets({
                variables: {
                  questionType,
                  url: url,
                  questionNumber: removeStartAndEnd(removeExtension((file as File)?.name)),
                },
                onError: (error: any) => {
                  handleGraphqlErrors(error);
                },
                onCompleted: ({ uploadAssets }) => {
                  toast.success(uploadAssets, {
                    position: "bottom-left",
                  });
                },
              });

              uploadedCount++;
              console.log(
                `✅ Uploaded ${uploadedCount} / ${files.length} files`
              );

            } catch (error) {
              console.error("Upload error:", error);
            }
            console.log(
              `🚀 Completed batch ${(chunkIndex as number) + 1}/${fileChunks.length}`
            );
          })
        );
        console.log("✅ Completed batch of 20 files");

        // ✅ Wait 2 seconds between each chunk (adjust as needed)
        await sleep(5000);
      }


      methods.reset()
      methods.resetField("files")
      toast.success(`All ${uploadedCount} files uploaded successfully!`, {
        position: "bottom-left",
      });

    } catch (error) {
      console.error("Batch upload failed:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("[&_label.block>span]:font-medium space-y-6")}
      >
        <FilesUpload />
        <div className="flex items-center justify-center">
          <Button
            variant="solid"
            color="primary"
            className={cn(true && "shadow-button ")}
            type="submit"
            disabled={loading}
            isLoading={loading}
          >
            Upload
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;
