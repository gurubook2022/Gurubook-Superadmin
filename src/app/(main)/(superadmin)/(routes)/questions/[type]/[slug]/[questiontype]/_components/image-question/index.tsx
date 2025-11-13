import { getImageQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface ImageQuestionProps {
  slug: string;
}

const ImageQuestion = async ({ slug }: ImageQuestionProps) => {
  const response = await getImageQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={JSON.parse(response?.data?.getImageQuestionDetails) as DlQuestion}
      />
    </div>
  );
};

export default ImageQuestion;
