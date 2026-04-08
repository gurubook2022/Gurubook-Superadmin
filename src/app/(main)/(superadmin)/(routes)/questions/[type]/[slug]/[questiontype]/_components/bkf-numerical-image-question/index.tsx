import { getBkfNumericalImageQuestionDetails } from "../../actions";
import { BKFQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface BkfNumericalImageQuestionProps {
  slug: string;
}

const BkfNumericalImageQuestion = async ({ slug }: BkfNumericalImageQuestionProps) => {
  const response = await getBkfNumericalImageQuestionDetails(slug);
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

export default BkfNumericalImageQuestion;
