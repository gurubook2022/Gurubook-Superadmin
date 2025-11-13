import MultiFileUploadZone from "@/components/ui/mutliple-file-upload-zone";
import { useFormContext } from "react-hook-form";
import { Title, Text } from "@/components/ui/text";

const FilesUpload = () => {
  const { setValue, getValues, formState } = useFormContext();
  return (
    <div className="space-y-2">
      <>
        <Title>Select Files</Title>
        <Text>Please Select Files (Images & Videos)</Text>
      </>
      <MultiFileUploadZone
        name="files"
        // setValue={setValue}
        // getValues={getValues}
        error={formState?.errors?.files?.message as string}
      />
    </div>
  );
};

export default FilesUpload;
