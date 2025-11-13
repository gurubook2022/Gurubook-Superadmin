import UploadZone from "@/components/ui/upload-zone";
import { useFormContext } from "react-hook-form";

const UploadFile = () => {
  const { setValue, getValues, formState } = useFormContext();
  return (
    <UploadZone
      name="file"
      setValue={setValue}
      error={formState?.errors?.file?.message as string}
      getValues={getValues}
      inputType="File"
    />
  );
};

export default UploadFile;
