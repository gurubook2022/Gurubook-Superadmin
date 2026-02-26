import BackButton from "@/components/back-button";
import SoloQuestion from "./_components/solo-question";
import ImageQuestion from "./_components/image-question";
import NumericalQuestion from "./_components/numerical-question";
import VideoQuestion from "./_components/video-question";
import BkfSoloQuestion from "./_components/bkf-solo-question";
import BkfImageQuestion from "./_components/bkf-image-question";
import BkfNumericalQuestion from "./_components/bkf-numerical-question";

const page = ({
  params,
}: {
  params: { type: string; slug: string; questiontype: string };
}) => {
  const { slug, questiontype } = params;
  return (
    <div className="space-y-4">
      <BackButton />
      {/* DL Question Details Components */}
      {questiontype === "Solo" && <SoloQuestion slug={slug} />}
      {questiontype === "Image" && <ImageQuestion slug={slug} />}
      {questiontype === "Numerical" && <NumericalQuestion slug={slug} />}
      {questiontype === "Numerical Image" && <NumericalQuestion slug={slug} />}
      {questiontype === "Numerical Video" && <NumericalQuestion slug={slug} />}
      {questiontype === "Video" && <VideoQuestion slug={slug} />}
      {/* BKF Question Details Components */}
      {questiontype === "Bkf-Solo" && <BkfSoloQuestion slug={slug} />}
      {questiontype === "Bkf-Image" && <BkfImageQuestion slug={slug} />}
      {questiontype === "Bkf-Numerical" && <BkfNumericalQuestion slug={slug} />}
    </div>
  );
};

export default page;
