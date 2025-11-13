import Form from "./_components/form";
import BackButton from "@/components/back-button";

export const revalidate = 0;
const page = async ({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) => {
  return (
    <div className="space-y-4">
      <BackButton />
      <Form />
    </div>
  );
};

export default page;
