import QuestionDetails from "./question-details";
import { getBkfSoloQuestionDetails } from "../../actions";
import { BKFQuestion } from "../../types";

interface BkfSoloQuestionProps {
  slug: string;
}

const BkfSoloQuestion = async ({ slug }: BkfSoloQuestionProps) => {
  const response = await getBkfSoloQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={
          JSON.parse(response?.data?.getBkfSoloQuestionDetails) as BKFQuestion
        }
      />
    </div>
  );
};

export default BkfSoloQuestion;
