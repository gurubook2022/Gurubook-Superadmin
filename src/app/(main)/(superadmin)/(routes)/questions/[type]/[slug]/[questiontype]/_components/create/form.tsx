"use client";
import { UPLOAD_QUESTIONS } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UploadQuestionsInput,
  uploadQuestionsFormSchema,
} from "@/validators/upload-questions";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import UploadFile from "./upload-file";
import toast from "react-hot-toast";
import uploadFileToAWSS3Bucket from "@/lib/aws-sdk";

const Form = () => {
  const [uploadQuestions] = useMutation(UPLOAD_QUESTIONS);
  const [uploadLoading, setUploadLoading] = useState(false);

  const methods = useForm<UploadQuestionsInput>({
    resolver: zodResolver(uploadQuestionsFormSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (inputData: UploadQuestionsInput) => {
    const { file } = inputData;

    setUploadLoading(true);

    try {
      console.log("Uploading file to S3...");
      const url = await uploadFileToAWSS3Bucket(file, "csv");
      console.log("File uploaded to S3. URL:", url);
      await uploadQuestions({
        variables: {
          url: url,
        },
        onCompleted: ({ uploadQuestions }) => {
          toast.success("Questions Uploaded Successfully");
          setUploadLoading(false);
        },
        onError: (error: any) => {
          handleGraphqlErrors(error);
          setUploadLoading(false);
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("[&_label.block>span]:font-medium space-y-6")}
      >
        <UploadFile />
        <div className="flex items-center justify-center">
          <Button
            isLoading={uploadLoading}
            disabled={uploadLoading}
            variant="solid"
            color="primary"
            type="submit"
          >
            Upload
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;
