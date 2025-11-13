import UploadZone from "@/components/ui/upload-zone";
import { useFormContext } from "react-hook-form";

const VideoUpload = () => {
  const { setValue, getValues, formState } = useFormContext();
  return (
    <UploadZone
      name="videoUrl"
      setValue={setValue}
      inputType={"Video"}
      error={formState?.errors?.videoUrl?.message as string}
      getValues={getValues}
    />
  );
};

export default VideoUpload;
