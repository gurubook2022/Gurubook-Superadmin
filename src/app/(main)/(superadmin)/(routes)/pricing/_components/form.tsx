"use client";

import { useForm } from "react-hook-form";
import { Price } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceInput, priceFormSchema } from "@/validators/price";
import { Text, Title } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { UPDATE_PRICE } from "@/graphql/mutations";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormProps {
  initialData: Price | null;
}

const Form = ({ initialData }: FormProps) => {
  const { refresh } = useRouter();
  const [updatePrice, { loading }] = useMutation(UPDATE_PRICE);
  console.log(initialData, {
    dlNonApprovedLanguages: String(initialData?.dlNonApprovedLanguages) || "",
    dlApprovedLanguages: String(initialData?.dlApprovedLanguages) || "",
    bkfNonApprovedLanguages:
      String(initialData?.bkfNonApprovedLanguages) || "",
    bkfApprovedLanguages: String(initialData?.bkfApprovedLanguages) || "",
    vat: String(initialData?.vat) || "",
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceInput>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      dlNonApprovedLanguages: String(initialData?.dlNonApprovedLanguages) || "",
      dlApprovedLanguages: String(initialData?.dlApprovedLanguages) || "",
      bkfNonApprovedLanguages:
        String(initialData?.bkfNonApprovedLanguages) || "",
      bkfApprovedLanguages: String(initialData?.bkfApprovedLanguages) || "",
      vat: String(initialData?.vat) || "",
    },
  });

  const onSubmit = async (data: PriceInput) => {
    const {
      dlNonApprovedLanguages,
      dlApprovedLanguages,
      bkfApprovedLanguages,
      bkfNonApprovedLanguages,
      vat,
    } = data;
    const toastId = toast.loading(
      initialData ? "Updating Prices" : "Creating Prices",
      {
        position: "bottom-left",
      }
    );
    try {
      await updatePrice({
        variables: {
          dlNonApprovedLanguages: Number(dlNonApprovedLanguages),
          dlApprovedLanguages: Number(dlApprovedLanguages),
          bkfApprovedLanguages: Number(bkfApprovedLanguages),
          bkfNonApprovedLanguages: Number(bkfNonApprovedLanguages),
          vat: Number(vat),
          _id: initialData?._id,
        },
        onCompleted: () => {
          toast.success(
            initialData
              ? "Prices Updated Successfully"
              : "Prices Created Successfully",
            {
              position: "bottom-left",
            }
          );

          refresh();
        },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const title = initialData ? "Edit Prices" : "Create Prices";
  const description = initialData ? "Edit a Prices" : "Add new prices";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Title>{title}</Title>
          <Text>{description}</Text>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "gap-4 sm:gap-6 grid sm:grid-cols-2 lg:grid-cols-4  @container [&_label.block>span]:font-medium"
        )}
      >
        <Input
          label="Vat"
          placeholder="Vat"
          {...register(`vat`)}
          error={errors?.vat?.message}
          helperClassName="border-4"
          type="number"
        />
        <div className="sm:col-span-2 lg:col-span-4 space-y-2.5">
          <Title>Driving License</Title>
          <div className="sm:col-span-2 lg:col-span-4 gap-2 sm:gap-6 grid sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Approved Languages"
              placeholder="Approved Languages"
              {...register(`dlApprovedLanguages`)}
              error={errors?.dlApprovedLanguages?.message}
              helperClassName="border-4"
              type="number"
            />
            <Input
              label="Non Approved  LANGUAGES"
              placeholder="Non Approved  LANGUAGES"
              {...register(`dlNonApprovedLanguages`)}
              error={errors?.dlNonApprovedLanguages?.message}
              helperClassName="border-4"
              type="number"
            />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4 space-y-2.5">
          <Title>BKF</Title>
          <div className="sm:col-span-2 lg:col-span-4 gap-2 sm:gap-6 grid sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Approved Languages"
              placeholder="Approved Languages"
              {...register(`bkfApprovedLanguages`)}
              error={errors?.bkfApprovedLanguages?.message}
              helperClassName="border-4"
              type="number"
            />
            <Input
              label="Non Approved  LANGUAGES"
              placeholder="Non Approved  LANGUAGES"
              {...register(`bkfNonApprovedLanguages`)}
              error={errors?.bkfNonApprovedLanguages?.message}
              helperClassName="border-4"
              type="number"
            />
          </div>
        </div>
        <div className="sm:col-span-2 grid sm:grid-cols-2 lg:grid-cols-4 lg:col-span-4">
          <div className="flex items-center justify-center sm:col-span-2 lg:col-span-4 ">
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
