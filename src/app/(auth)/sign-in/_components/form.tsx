"use client";
import { cn } from "@/lib/utils";
import { Input, Password } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRightIcon } from "lucide-react";
import { SignInInput, signInFormSchema } from "@/validators/sign-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn, useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    const { email, password } = data;
    try {
      setLoading((loading) => !loading);

      const response = await signIn("credentials", {
        email,
        password,
        // callbackUrl: "/",
        redirect: false,
      });

      if (response?.status === 401) {
        toast.error("Wrong Credentials");
      } else if (response?.status === 200) {
        const session = await getSession();
        if (session?.user) {
          localStorage.setItem("accessToken", session?.user?.accessToken!);
        }
        // if (session.data) {
        //   localStorage.setItem(
        //     "accessToken",
        //     session?.data?.user?.accessToken!
        //   );
        // }
        window.location.href = "/";
      }
    } catch (error) {
    } finally {
      setLoading((loading) => !loading);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "gap-2 sm:gap-6 flex flex-grow flex-col @container [&_label.block>span]:font-medium"
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
          Sign In
          <MoveRightIcon className="ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default Form;
