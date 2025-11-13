import { getBkfImageQuestionDetails } from "../../actions";
import { BKFQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface BkfImageQuestionProps {
  slug: string;
}

const BkfImageQuestion = async ({ slug }: BkfImageQuestionProps) => {
  const response = await getBkfImageQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={
          JSON.parse(response?.data?.getBkfImageQuestionDetails) as BKFQuestion
        }
      />
    </div>
  );
};

export default BkfImageQuestion;
