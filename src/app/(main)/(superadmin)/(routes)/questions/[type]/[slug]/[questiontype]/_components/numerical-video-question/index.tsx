import { getNumericalQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface NumericalVideoQuestionProps {
  slug: string;
}

const NumericalVideoQuestion = async ({ slug }: NumericalVideoQuestionProps) => {
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

export default NumericalVideoQuestion;
