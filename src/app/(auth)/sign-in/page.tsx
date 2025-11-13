import { Title } from "@/components/ui/text";
import Form from "./_components/form";
const page = async () => {
  return (
    <div className="w-full space-y-4 sm:space-y-8">
      <Title className="text-center">Sign in to your Account</Title>
      <Form />
    </div>
  );
};

export default page;
