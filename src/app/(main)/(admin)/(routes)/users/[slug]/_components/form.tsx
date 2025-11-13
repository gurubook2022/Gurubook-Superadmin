"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { Input, Password } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import {
  MAKE_CASH_PAYMENT,
  REGISTER_USER,
  USERREGISTERBYADMIN,
} from "@/graphql/mutations";
import toast from "react-hot-toast";
import { Title, Text } from "@/components/ui/text";
import { useRouter } from "next/navigation";
import { UserInput, userFormSchema } from "@/validators/user";
import Select from "@/components/ui/select";
import { LANGUAGES } from "@/constants/languages";

import ReactSelect from "react-select";
import { dlClasses } from "@/constants/classes";
import { userTypeOptions } from "@/data/user-types";


const Form = () => {
  const { refresh, push } = useRouter();
  const [userRegisterByAdmin, { loading: userRegisterByAdminLoading }] =
    useMutation(USERREGISTERBYADMIN);
  const [makeCashPayment, { loading: makeCashPaymentLoading }] =
    useMutation(MAKE_CASH_PAYMENT);

  // Register Mutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "",
      password: "",
      examLanguage: "",
      learningLanguage: "",
      country: "GERMANY",
      city: "",
      postalCode: "",
      address: "",
      phone: "",
    },
  });

  const onSubmit = async (data: UserInput) => {
    const {
      email,
      firstName,
      lastName,
      password,
      role,
      examLanguage,
      learningLanguage,
      phone,
      city,
      country,
      postalCode,
      address: inputAddress,
      classes,
    } = data;

    const selectedExamLanguage = LANGUAGES?.find(
      (language) => language?.title === examLanguage
    );
    const selectedLearningLanguage = LANGUAGES?.find(
      (language) => language?.title === learningLanguage
    );
    const toastId = toast.loading("Creating User", {
      position: "bottom-left",
    });
    try {
      const address = {
        city,
        country,
        postalCode: Number(postalCode),
        address: inputAddress,
      };
      await registerUser({
        variables: {
          email,
          firstName,
          lastName,
          password,
          role,
          phone: `+49${phone}`,
          address,
        },
        onCompleted: async ({ register }) => {
          // Dependent Query so we can use the userId which we can use to make the cash payment
          await makeCashPayment({
            variables: {
              userId: register?._id,
              languageCode: selectedLearningLanguage
                ? selectedLearningLanguage?.code
                : selectedExamLanguage?.code,
              classes,
              examLanguage: selectedExamLanguage?.code,
              learningLanguage: selectedLearningLanguage?.code,
            },
          });
          // Dependent Query so we can use the userId which we can use to set from which admin this user is created
          await userRegisterByAdmin({
            variables: { userId: register?._id as string },
            onCompleted: async ({ }) => {
              toast.success("User Created Successfully", {
                position: "bottom-left",
              });

              toast.dismiss(toastId);
              push("/users");
              refresh();
            },
          });
        },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
    }
  };

  const examLanguages = LANGUAGES?.filter(
    (language) => language?.isApproved
  )?.map((language) => ({
    value: language?.code,
    name: language?.title,
    label: language?.title,
  }));
  const learningLanguages = LANGUAGES?.filter(
    (language) => !language?.isApproved
  )?.map((language) => ({
    value: language?.code,
    name: language?.title,
    label: language?.title,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Title>Create User</Title>
          <Text>Add a new user</Text>
        </div>
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

        <div className="max-w-96 mx-auto w-full ">
          <label
            className={cn(
              "mb-1.5 block font-medium text-gray-700 dark:text-gray-600"
            )}
          >
            Classes
          </label>
          <Controller
            control={control}
            name={`classes`}
            render={({ field: { onChange, value } }) => (
              <>
                <ReactSelect
                  className="outline-gray-700 accent-current focus:outline-none focus:border-0  w-full"
                  isMulti={true}
                  value={value?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  options={dlClasses?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(selectItem) => {
                    onChange(selectItem?.map((item) => item.value));
                  }}
                />
                {errors?.classes?.message && (
                  <p className="text-red text-xs mt-0.5 rizzui-input-error-text">
                    {errors?.classes?.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <Input
          label="Phone"
          placeholder="Phone"
          {...register(`phone`)}
          prefix="+49"
          error={errors?.phone?.message}
          helperClassName="border-4"
        />
        <Input
          label="Country"
          placeholder="Country"
          {...register(`country`)}
          error={errors?.country?.message}
          helperClassName="border-4"
          disabled
        />
        <Input
          label="Postal Code"
          placeholder="Postal Code"
          {...register(`postalCode`)}
          error={errors?.postalCode?.message}
          helperClassName="border-4"
        />
        <Input
          label="City"
          placeholder="City"
          {...register(`city`)}
          error={errors?.city?.message}
          helperClassName="border-4"
        />
        <Input
          label="Address"
          placeholder="Address"
          {...register(`address`)}
          error={errors?.address?.message}
          helperClassName="border-4"
        />
        <Controller
          name="role"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={userTypeOptions}
              value={value}
              onChange={onChange}
              label="User Type"
              error={errors?.role?.message}
              getOptionValue={(option) => option.name}
            />
          )}
        />
        <Controller
          name="examLanguage"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={examLanguages}
              value={value}
              onChange={onChange}
              label="Exam Language"
              error={errors?.examLanguage?.message}
              getOptionValue={(option) => option.name}
            />
          )}
        />
        <Controller
          name="learningLanguage"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={learningLanguages}
              value={value}
              onChange={onChange}
              label="Learning Language"
              error={errors?.learningLanguage?.message}
              getOptionValue={(option) => option.name}
            />
          )}
        />
        <Button
          variant="solid"
          color="primary"
          type="submit"
          disabled={
            loading || userRegisterByAdminLoading || makeCashPaymentLoading
          }
          isLoading={
            loading || userRegisterByAdminLoading || makeCashPaymentLoading
          }
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default Form;
