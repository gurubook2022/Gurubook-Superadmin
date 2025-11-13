import { getSoloQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface SoloQuestionProps {
  slug: string;
}

const SoloQuestion = async ({ slug }: SoloQuestionProps) => {
  const response = await getSoloQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={JSON.parse(response?.data?.getSoloQuestionDetails) as DlQuestion}
      />
    </div>
  );
};

export default SoloQuestion;
