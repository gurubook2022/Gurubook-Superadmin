import BackButton from "@/components/back-button";
import SoloQuestion from "./_components/solo-question";
import ImageQuestion from "./_components/image-question";
import NumericalQuestion from "./_components/numerical-question";
import NumericalImageQuestion from "./_components/numerical-image-question";
import NumericalVideoQuestion from "./_components/numerical-video-question";
import VideoQuestion from "./_components/video-question";
import BkfSoloQuestion from "./_components/bkf-solo-question";
import BkfImageQuestion from "./_components/bkf-image-question";
import BkfNumericalQuestion from "./_components/bkf-numerical-question";
import BkfNumericalImageQuestion from "./_components/bkf-numerical-image-question";

const page = ({
  params,
}: {
  params: { type: string; slug: string; questiontype: string };
}) => {
  const { slug, questiontype } = params;
  console.log("Question Type:", questiontype);
  return (
    <div className="space-y-4">
      <BackButton />
      {/* DL Question Details Components */}
      {questiontype === "Solo" && <SoloQuestion slug={slug} />}
      {questiontype === "Image" && <ImageQuestion slug={slug} />}
      {questiontype === "Numerical" && <NumericalQuestion slug={slug} />}
      {questiontype === "Numerical-Image" && <NumericalImageQuestion slug={slug} />}
      {questiontype === "Numerical-Video" && <NumericalVideoQuestion slug={slug} />}
      {questiontype === "Video" && <VideoQuestion slug={slug} />}
      {/* BKF Question Details Components */}
      {questiontype === "Bkf-Solo" && <BkfSoloQuestion slug={slug} />}
      {questiontype === "Bkf-Image" && <BkfImageQuestion slug={slug} />}
      {questiontype === "Bkf-Numerical" && <BkfNumericalQuestion slug={slug} />}
      {questiontype === "Bkf-Numerical-Image" && <BkfNumericalImageQuestion slug={slug} />}
    </div>
  );
};

export default page;
