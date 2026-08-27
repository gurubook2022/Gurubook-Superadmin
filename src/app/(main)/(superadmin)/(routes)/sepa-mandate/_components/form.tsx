"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, getS3FileUrl, handleGraphqlErrors } from "@/lib/utils";
import { UPSERT_SEPA_MANDATE } from "@/graphql/mutations";
import {
  SepaMandateInput,
  sepaMandateFormSchema,
} from "@/validators/sepa-mandate";
import uploadFileToAWSS3Bucket from "@/lib/aws-sdk";
import { SepaMandateT } from "../types";

interface FormProps {
  initialData: SepaMandateT | null;
}

const toDateInputValue = (timestamp?: number) => {
  if (!timestamp) return "";
  return new Date(timestamp).toISOString().slice(0, 10);
};

const Form = ({ initialData }: FormProps) => {
  const { refresh } = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [upsertSepaMandate, { loading }] = useMutation(UPSERT_SEPA_MANDATE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SepaMandateInput>({
    resolver: zodResolver(sepaMandateFormSchema),
    defaultValues: {
      status: initialData?.status || "ACTIVE",
      mandateReference: initialData?.mandateReference || "",
      version: initialData?.version || "1.0",
      signedOn: toDateInputValue(initialData?.signedOn) || "",
    },
  });

  const onSubmit = async (data: SepaMandateInput) => {
    if (!selectedFile && !initialData?.fileKey) {
      setFileError("Mandate document (PDF) is required.");
      return;
    }
    setFileError(null);

    const { status, mandateReference, version, signedOn } = data;
    const toastId = toast.loading(
      initialData ? "Updating SEPA Mandate" : "Creating SEPA Mandate",
      { position: "bottom-left" }
    );
    try {
      let fileKey = initialData?.fileKey || "";
      if (selectedFile) {
        setUploading(true);
        fileKey = await uploadFileToAWSS3Bucket(selectedFile, "sepa-mandates");
        setUploading(false);
      }

      await upsertSepaMandate({
        variables: {
          _id: initialData?._id,
          status,
          mandateReference,
          version,
          signedOn: new Date(signedOn).getTime(),
          fileKey,
        },
        onCompleted: () => {
          toast.success(
            initialData
              ? "SEPA Mandate Updated Successfully"
              : "SEPA Mandate Created Successfully",
            { position: "bottom-left" }
          );
          setSelectedFile(null);
          refresh();
        },
      });
    } catch (error: any) {
      setUploading(false);
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const title = initialData ? "Edit SEPA Mandate" : "Create SEPA Mandate";
  const description = initialData
    ? "Update the SEPA mandate shown to every admin."
    : "This mandate and document will be shown to every admin.";
  const isSubmitting = loading || uploading;

  return (
    <div className="space-y-4">
      <div>
        <Title>{title}</Title>
        <Text>{description}</Text>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "gap-4 sm:gap-6 grid sm:grid-cols-2 lg:grid-cols-4 @container [&_label.block>span]:font-medium"
        )}
      >
        <div className="grid">
          <span className="mb-1.5 block font-semibold text-gray-900">
            Status
          </span>
          <select
            {...register("status")}
            className="w-full h-10 rounded-md border border-gray-300 bg-gray-0 px-3 text-sm focus:outline-none focus:border-gray-1000"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {errors?.status?.message && (
            <Text className="text-red text-xs mt-1">
              {errors.status.message}
            </Text>
          )}
        </div>
        <Input
          label="Mandate Reference"
          placeholder="e.g. GM100001-20250612-01"
          {...register("mandateReference")}
          error={errors?.mandateReference?.message}
        />
        <Input
          label="Version"
          placeholder="e.g. 1.0"
          {...register("version")}
          error={errors?.version?.message}
        />
        <Input
          label="Signed On"
          type="date"
          {...register("signedOn")}
          error={errors?.signedOn?.message}
        />

        <div className="sm:col-span-2 lg:col-span-4 space-y-2">
          <Title className="text-base">Mandate Document (PDF)</Title>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 me-1.5" />
              {selectedFile || initialData?.fileKey
                ? "Replace File"
                : "Choose File"}
            </Button>
            {selectedFile && (
              <Text className="truncate max-w-xs">{selectedFile.name}</Text>
            )}
            {!selectedFile && initialData?.fileKey && (
              <a
                href={getS3FileUrl(initialData.fileKey)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                View current file
              </a>
            )}
          </div>
          {fileError && (
            <Text className="text-red text-xs">{fileError}</Text>
          )}
        </div>

        <Button
          variant="solid"
          color="primary"
          className={cn(true && "shadow-button ")}
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default Form;
