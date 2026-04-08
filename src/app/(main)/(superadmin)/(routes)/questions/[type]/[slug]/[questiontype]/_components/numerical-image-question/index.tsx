import { getNumericalQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface NumericalImageQuestionProps {
  slug: string;
}

const NumericalImageQuestion = async ({ slug }: NumericalImageQuestionProps) => {
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

export default NumericalImageQuestion;
