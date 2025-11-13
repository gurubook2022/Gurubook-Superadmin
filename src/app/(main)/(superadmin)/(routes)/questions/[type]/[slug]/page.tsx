import BackButton from "@/components/back-button";
import Form from "./[questiontype]/_components/create/form";

export const revalidate = 0;

const page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    type: string;
  };
}) => {
  const { slug } = params;
  // getSoloQuestionDetails()
  if (slug === "create") {
    return (
      <div>
        <Form />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <BackButton />
      {/* <SoloQuestion slug={slug} /> */}
      {/* {type === "Solo" && <SoloQuestion slug={slug} />}
      {type === "Image" && <ImageQuestion slug={slug} />}
      {type === "Numerical" && <NumericalQuestion slug={slug} />}
      {type === "Video" && <VideoQuestion slug={slug} />} */}
    </div>
  );
};

export default page;
