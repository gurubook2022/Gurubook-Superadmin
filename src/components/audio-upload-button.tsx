"use client";

import { useRef, useState } from "react";
import { ActionIcon } from "@/components/ui/action-icon";
import { Tooltip } from "@/components/ui/tooltip";
import { UploadIcon } from "lucide-react";
import toast from "react-hot-toast";
import uploadFileToAWSS3Bucket from "@/lib/aws-sdk";
import { AUDIO_S3_FOLDER } from "@/constants/audio";

interface AudioUploadButtonProps {
  /** Target file name without extension, e.g. `${questionNumber}-title-${lang}` */
  fileName: string;
  onUploaded: (key: string) => void;
  disabled?: boolean;
}

const AudioUploadButton = ({
  fileName,
  onUploaded,
  disabled,
}: AudioUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const isMp3 =
      file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");
    if (!isMp3) {
      toast.error("Only .mp3 files are supported", {
        position: "bottom-left",
      });
      return;
    }

    setUploading(true);
    try {
      const key = await uploadFileToAWSS3Bucket(
        file,
        AUDIO_S3_FOLDER,
        `${fileName}.mp3`
      );
      if (!key) throw new Error("Upload did not return a key");
      onUploaded(key);
      toast.success("Audio uploaded successfully", {
        position: "bottom-left",
      });
    } catch (error) {
      console.error("Audio upload error:", error);
      toast.error("Failed to upload audio", {
        position: "bottom-left",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,.mp3"
        className="hidden"
        onChange={handleChange}
        disabled={disabled || uploading}
      />
      <Tooltip
        size="sm"
        content={() => "Upload Audio (.mp3)"}
        placement="top"
        color="invert"
      >
        <ActionIcon
          type="button"
          size="sm"
          variant="outline"
          isLoading={uploading}
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="hover:!border-gray-900 hover:text-gray-700 shrink-0"
        >
          <UploadIcon className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export default AudioUploadButton;
