"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
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
import StudentCredentialsDialog from "./student-credentials-dialog";

import ReactSelect from "react-select";
import {
  dlClasses,
  bkfClasses,
  bkfClassIcons,
  acquiredClasses as acquiredClassCodes,
} from "@/constants/classes";
import {
  getClassesToRemove,
  getDisabledClasses,
  getDisabledClassesByAcquired,
  getDisabledClassesFromAcquired,
} from "@/lib/classes";
import {
  Car,
  GraduationCap,
  Info,
  Send,
  Share2,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";

const generateTempPassword = () => {
  const random =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2);
  return `Gb!${random.slice(0, 10)}A9`;
};

const userTypeOptions = [
  {
    value: "USER",
    label: "Driving License (DL)",
    icon: Car,
    description: "Student is preparing for a driving license theory exam.",
  },
  {
    value: "BKFUSER",
    label: "BKF",
    icon: Truck,
    description:
      "Student is preparing for the BKF professional driver qualification.",
  },
] as const;

const purposeOptions = [
  {
    value: "EXTENSION",
    label: "Extension",
    icon: Share2,
    description:
      "Student already has a license and wants to learn additional classes.",
  },
  {
    value: "NEW",
    label: "New Licence",
    icon: Sparkles,
    description: "Student is applying for a brand-new license.",
  },
] as const;

const Form = () => {
  const { refresh, push } = useRouter();
  const [userRegisterByAdmin, { loading: userRegisterByAdminLoading }] =
    useMutation(USERREGISTERBYADMIN);
  const [makeCashPayment, { loading: makeCashPaymentLoading }] =
    useMutation(MAKE_CASH_PAYMENT);

  // Register Mutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      userType: "USER",
      purpose: "EXTENSION",
      acquiredClasses: [],
      classes: undefined,
      examLanguage: "",
      learningLanguage: "",
    },
  });

  const userType = watch("userType");
  const purpose = watch("purpose");
  const selectedClasses = watch("classes") ?? [];
  const selectedAcquiredClasses = watch("acquiredClasses") ?? [];

  // Classes already implied by another selected "already owned" class
  // (e.g. picking C also covers C1), so they can't be picked separately.
  const impliedFromAcquiredSelection = selectedAcquiredClasses.flatMap(
    getDisabledClassesByAcquired
  );
  // Classes implied by the exam classes already selected.
  const disabledFromSelectedExam = selectedClasses.flatMap(getDisabledClasses);
  // On Extension, classes the student already owns (and everything those
  // imply) can't also be picked as classes they want to learn.
  const disabledFromAcquiredForExam =
    purpose === "EXTENSION"
      ? getDisabledClassesFromAcquired(selectedAcquiredClasses)
      : [];

  const handleUserTypeChange = (value: UserInput["userType"]) => {
    if (userType === value) return;
    setValue("userType", value);
    // The valid class/language options differ per program, so drop any
    // selection made under the previous program type.
    setValue("classes", undefined as unknown as UserInput["classes"]);
    setValue("examLanguage", "");
    setValue("learningLanguage", "");
    if (value === "BKFUSER") {
      // BKF has no New/Extension distinction and no already-owned classes.
      setValue("purpose", "NEW");
      setValue("acquiredClasses", []);
    }
  };

  const onSubmit = async (data: UserInput) => {
    const {
      email,
      firstName,
      lastName,
      examLanguage,
      learningLanguage,
      classes,
      purpose,
      acquiredClasses,
      userType,
    } = data;

    const selectedExamLanguage = LANGUAGES?.find(
      (language) => language?.title === examLanguage
    );
    const selectedLearningLanguage = LANGUAGES?.find(
      (language) => language?.title === learningLanguage
    );
    const toastId = toast.loading("Creating Student", {
      position: "bottom-left",
    });
    try {
      const password = generateTempPassword();
      await registerUser({
        variables: {
          email,
          firstName,
          lastName,
          password,
          role: userType,
          address: {},
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
              learningFor: purpose,
              acquiredClasses: purpose === "EXTENSION" ? acquiredClasses : [],
            },
          });
          // Dependent Query so we can use the userId which we can use to set from which admin this user is created
          await userRegisterByAdmin({
            variables: { userId: register?._id as string },
            onCompleted: async ({ }) => {
              toast.success("Student account created", {
                position: "bottom-left",
              });

              toast.dismiss(toastId);
              setCredentials({ email, password });
            },
          });
        },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
    }
  };

  const handleCredentialsDialogClose = () => {
    setCredentials(null);
    push("/users");
    refresh();
  };

  const examLanguages = LANGUAGES?.filter((language) =>
    userType === "BKFUSER"
      ? language?.code === "en" || language?.code === "de"
      : language?.isApproved
  )
    ?.map((language) => ({
      value: language?.code,
      name: language?.title,
      label: language?.title,
      flag: language?.flag,
    }))
    ?.sort((a, b) => a.label.localeCompare(b.label));
  const learningLanguages = LANGUAGES?.filter((language) =>
    userType === "BKFUSER" ? language?.code !== "de" : !language?.isApproved
  )
    ?.map((language) => ({
      value: language?.code,
      name: language?.title,
      label: language?.title,
      flag: language?.flag,
    }))
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const renderLanguageDisplayValue = (
    options: typeof examLanguages,
    value: unknown
  ) => {
    const language = options?.find((option) => option?.name === value);
    if (!language) return value as string;
    return (
      <span className="flex items-center gap-2">
        <img
          src={`/assets/icons/flags/${language.flag}.svg`}
          alt=""
          className="h-5 w-5 object-contain"
        />
        {language.label}
      </span>
    );
  };

  const examClassOptions = (userType === "BKFUSER" ? bkfClasses : dlClasses)?.map(
    (item) => ({
      value: item,
      label: item,
    })
  );
  const acquiredClassOptions = acquiredClassCodes?.map((item) => ({
    value: item,
    label: item,
  }));

  const formatClassOptionLabel = (
    option: { value: string; label: string },
    { context }: { context: "menu" | "value" }
  ) => {
    // BKF classes (LKW/BUS) have no dedicated icon assets — reuse the DL
    // C/D icons for them, same as the student-facing signup flow does.
    const iconCode = bkfClassIcons[option.value] ?? option.value;
    return (
      <div className="flex items-center gap-2">
        <img
          src={`/assets/icons/classes/${iconCode}${context === "value" ? "-light" : ""}.svg`}
          alt=""
          className="h-4 w-10 object-contain"
        />
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Title>Create New Student</Title>
        <Text>
          Add student details and send an invitation to activate their
          GuruBook account.
        </Text>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-gray-0 p-6 dark:bg-gray-50">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter/40 text-primary-dark">
              <UserRound className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold text-gray-900">
              1. Student Information
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 @container sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="First Name"
              placeholder="Enter first name"
              {...register(`firstName`)}
              error={errors?.firstName?.message}
              helperClassName="border-4"
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register(`lastName`)}
              error={errors?.lastName?.message}
              helperClassName="border-4"
            />
            <Input
              label="Email Address"
              placeholder="Enter email address"
              {...register(`email`)}
              error={errors?.email?.message}
              helperClassName="border-4"
              type="email"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-0 p-6 dark:bg-gray-50">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter/40 text-primary-dark">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold text-gray-900">
              2. License &amp; Learning Settings
            </h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-600">
                Program Type
                <span className="ms-1 font-medium text-red-light">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {userTypeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleUserTypeChange(value)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      userType === value
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-gray-0 text-gray-700 hover:border-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
              <Text className="mt-1.5 text-xs text-gray-500">
                {userTypeOptions.find((option) => option.value === userType)
                  ?.description}
              </Text>
            </div>

            {userType !== "BKFUSER" && (
              <div>
                <label className="mb-1.5 block font-medium text-gray-700 dark:text-gray-600">
                  Purpose<span className="ms-1 font-medium text-red-light">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {purposeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (purpose === value) return;
                        setValue("purpose", value);
                        // Acquired classes only apply to extensions.
                        setValue("acquiredClasses", []);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                        purpose === value
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-gray-0 text-gray-700 hover:border-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <Text className="mt-1.5 text-xs text-gray-500">
                  {purposeOptions.find((option) => option.value === purpose)
                    ?.description}
                </Text>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 @container sm:grid-cols-2">
              {userType !== "BKFUSER" && purpose === "EXTENSION" && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1 font-medium text-gray-700 dark:text-gray-600">
                    Already Owned License Class(es)
                    <span className="font-medium text-red-light">*</span>
                    <Tooltip
                      size="sm"
                      placement="top"
                      color="invert"
                      content={() => "Classes the student already has a license for."}
                    >
                      <Info className="h-3.5 w-3.5 text-gray-400" />
                    </Tooltip>
                  </label>
                  <Controller
                    control={control}
                    name={`acquiredClasses`}
                    render={({ field: { onChange, value } }) => (
                      <ReactSelect
                        className="outline-gray-700 accent-current focus:outline-none focus:border-0 w-full"
                        isMulti={true}
                        value={value?.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        options={acquiredClassOptions}
                        isOptionDisabled={(option) =>
                          impliedFromAcquiredSelection.includes(option.value)
                        }
                        formatOptionLabel={formatClassOptionLabel}
                        onChange={(selectItem) => {
                          const nextValues =
                            selectItem?.map((item) => item.value) ?? [];
                          const added = nextValues.find(
                            (item) => !value?.includes(item)
                          );

                          // Picking a higher class (e.g. C) makes any
                          // lower class it already covers (e.g. C1)
                          // redundant, so drop it from the selection.
                          const finalValues = added
                            ? Array.from(new Set(nextValues)).filter(
                                (item) =>
                                  item === added ||
                                  !getDisabledClassesByAcquired(added).includes(
                                    item
                                  )
                              )
                            : nextValues;

                          onChange(finalValues);

                          // A class the student already owns can't also be
                          // something they want to learn, so drop it (and
                          // anything it implies) from the exam classes too.
                          const nowDisabled =
                            getDisabledClassesFromAcquired(finalValues);
                          const currentExamClasses = getValues("classes") ?? [];
                          setValue(
                            "classes",
                            currentExamClasses.filter(
                              (item) => !nowDisabled.includes(item)
                            ) as UserInput["classes"]
                          );
                        }}
                      />
                    )}
                  />
                  <Text className="mt-1 text-xs text-gray-500">
                    Select all classes the student already has.
                  </Text>
                  {errors?.acquiredClasses?.message && (
                    <p className="text-red text-xs mt-0.5 rizzui-input-error-text">
                      {errors?.acquiredClasses?.message}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="mb-1.5 flex items-center gap-1 font-medium text-gray-700 dark:text-gray-600">
                  Examination Class(es) (Learning For)
                  <span className="font-medium text-red-light">*</span>
                  <Tooltip
                    size="sm"
                    placement="top"
                    color="invert"
                    content={() => "Classes the student wants to learn and be examined on."}
                  >
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </Tooltip>
                </label>
                <Controller
                  control={control}
                  name={`classes`}
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      className="outline-gray-700 accent-current focus:outline-none focus:border-0 w-full"
                      isMulti={true}
                      value={value?.map((item) => ({
                        value: item,
                        label: item,
                      }))}
                      options={examClassOptions}
                      isOptionDisabled={(option) =>
                        (purpose === "EXTENSION" && option.value === "MOFA") ||
                        disabledFromSelectedExam.includes(option.value) ||
                        disabledFromAcquiredForExam.includes(option.value)
                      }
                      formatOptionLabel={formatClassOptionLabel}
                      onChange={(selectItem) => {
                        const nextValues =
                          selectItem?.map((item) => item.value) ?? [];
                        const added = nextValues.find(
                          (item) => !value?.includes(item)
                        );

                        let finalValues = nextValues;
                        if (added) {
                          const classesToRemove = getClassesToRemove(added);
                          // Getting CE/C1/C/D1/D on a new licence always
                          // requires holding B first, and CE requires C too.
                          const impliedByNew =
                            purpose === "NEW"
                              ? [
                                  ...(added === "CE" ? ["C"] : []),
                                  ...(["CE", "C1", "C", "D1", "D"].includes(
                                    added
                                  )
                                    ? ["B"]
                                    : []),
                                ]
                              : [];

                          finalValues = Array.from(
                            new Set([...nextValues, ...impliedByNew])
                          ).filter(
                            (item) =>
                              item === added ||
                              impliedByNew.includes(item) ||
                              !classesToRemove.includes(item)
                          );
                        }

                        onChange(finalValues);
                      }}
                    />
                  )}
                />
                <Text className="mt-1 text-xs text-gray-500">
                  Select the new classes the student wants to learn.
                </Text>
                {errors?.classes?.message && (
                  <p className="text-red text-xs mt-0.5 rizzui-input-error-text">
                    {errors?.classes?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 @container sm:grid-cols-2">
              <Controller
                name="examLanguage"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={examLanguages}
                    value={value}
                    onChange={onChange}
                    label="Examination Language (Official)"
                    error={errors?.examLanguage?.message}
                    getOptionValue={(option) => option.name}
                    getOptionDisplayValue={(option: any) => (
                      <span className="flex items-center gap-2">
                        <img
                          src={`/assets/icons/flags/${option.flag}.svg`}
                          alt=""
                          className="h-5 w-5 object-contain"
                        />
                        {option.label}
                      </span>
                    )}
                    displayValue={(value) =>
                      renderLanguageDisplayValue(examLanguages, value)
                    }
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
                    label="Learning Language (App)"
                    error={errors?.learningLanguage?.message}
                    getOptionValue={(option) => option.name}
                    getOptionDisplayValue={(option: any) => (
                      <span className="flex items-center gap-2">
                        <img
                          src={`/assets/icons/flags/${option.flag}.svg`}
                          alt=""
                          className="h-5 w-5 object-contain"
                        />
                        {option.label}
                      </span>
                    )}
                    displayValue={(value) =>
                      renderLanguageDisplayValue(learningLanguages, value)
                    }
                  />
                )}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => push("/users")}
          >
            Cancel
          </Button>
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
            <Send className="me-2 h-4 w-4" />
            Create Account &amp; Send Invitation
          </Button>
        </div>
      </form>

      <StudentCredentialsDialog
        isOpen={!!credentials}
        email={credentials?.email ?? ""}
        password={credentials?.password ?? ""}
        onClose={handleCredentialsDialogClose}
      />
    </div>
  );
};

export default Form;
