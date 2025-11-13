"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { Input, Password } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminInput, adminFormSchema } from "@/validators/admin";
import { useMutation } from "@apollo/client";
import { REGISTER_ADMIN } from "@/graphql/mutations";
import toast from "react-hot-toast";
import { UserT } from "../types";
import { Title, Text } from "@/components/ui/text";
import { useRouter } from "next/navigation";
import DeleteButton from "./delete-button";

interface FormProps {
  initialData: UserT | null;
}

const Form = ({ initialData }: FormProps) => {
  const { refresh, push } = useRouter();

  // Create Mutation
  const [registerAdmin, { loading }] = useMutation(REGISTER_ADMIN, {
    onCompleted: () => {
      toast.success("Admin Created Successfully", {
        position: "bottom-left",
      });

      push("/admins");
      refresh();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminInput>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: initialData?.email || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminInput) => {
    const { email, firstName, lastName, password } = data;
    const toastId = toast.loading("Creating Admin", {
      position: "bottom-left",
    });
    try {
      await registerAdmin({
        variables: { email, firstName, lastName, password },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const title = initialData ? "Edit Admin" : "Create Admin";
  const description = initialData ? "Edit an admin" : "Add a new admin";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Title>{title}</Title>
          <Text>{description}</Text>
        </div>
        {initialData && <DeleteButton _id={initialData?._id} />}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "gap-2 sm:gap-6 grid grid-cols-4  @container [&_label.block>span]:font-medium"
        )}
      >
        <Input
          label="Email"
          placeholder="Email"
          {...register(`email`)}
          error={errors?.email?.message}
          helperClassName="border-4"
          type="email"
        />
        <Input
          label="First Name"
          placeholder="First Name"
          {...register(`firstName`)}
          error={errors?.firstName?.message}
          helperClassName="border-4"
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          {...register(`lastName`)}
          error={errors?.email?.message}
          helperClassName="border-4"
        />
        <Password
          label="Password"
          placeholder="Password"
          {...register(`password`)}
          error={errors?.password?.message}
        />
        <Button
          variant="solid"
          color="primary"
          className={cn(true && "shadow-button ")}
          type="submit"
          disabled={loading}
          isLoading={loading}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default Form;
