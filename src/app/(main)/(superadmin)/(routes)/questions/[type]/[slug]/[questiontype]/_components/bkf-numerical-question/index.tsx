import { getBkfNumericalQuestionDetails } from "../../actions";
import { BKFQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface BkfNumericalQuestionProps {
  slug: string;
}

const BkfNumericalQuestion = async ({ slug }: BkfNumericalQuestionProps) => {
  const response = await getBkfNumericalQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={
          JSON.parse(
            response?.data?.getBkfNumericalQuestionDetails
          ) as BKFQuestion
        }
      />
    </div>
  );
};

export default BkfNumericalQuestion;
