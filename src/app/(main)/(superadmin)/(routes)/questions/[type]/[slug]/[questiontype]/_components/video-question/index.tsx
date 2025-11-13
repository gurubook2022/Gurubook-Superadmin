import { getVideoQuestionDetails } from "../../actions";
import { DlQuestion } from "../../types";
import QuestionDetails from "./question-details";

interface VideoQuestionProps {
  slug: string;
}

const VideoQuestion = async ({ slug }: VideoQuestionProps) => {
  const response = await getVideoQuestionDetails(slug);
  return (
    <div>
      <QuestionDetails
        data={JSON.parse(response?.data?.getVideoQuestionDetails) as DlQuestion}
      />
    </div>
  );
};

export default VideoQuestion;
