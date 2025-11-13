import UploadZone from "@/components/ui/upload-zone";
import { useFormContext } from "react-hook-form";

const ImageUpload = () => {
  const { setValue, getValues, formState } = useFormContext();
  return (
    <UploadZone
      name="imageUrl"
      setValue={setValue}
      error={formState?.errors?.imageUrl?.message as string}
      getValues={getValues}
    />
  );
};

export default ImageUpload;
