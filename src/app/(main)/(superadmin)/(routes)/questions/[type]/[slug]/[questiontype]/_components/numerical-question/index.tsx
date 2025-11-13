import { getNumericalQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface NumericalQuestionProps {
  slug: string;
}

const NumericalQuestion = async ({ slug }: NumericalQuestionProps) => {
  const response = await getNumericalQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={
          JSON.parse(response?.data?.getNumericalQuestionDetails) as DlQuestion
        }
      />
    </div>
  );
};

export default NumericalQuestion;
