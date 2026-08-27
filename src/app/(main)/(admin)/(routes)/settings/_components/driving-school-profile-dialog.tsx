"use client";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/ui/modal";
import { ActionIcon } from "@/components/ui/action-icon";
import { Title, Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { UPDATE_ADMIN_PROFILE } from "@/graphql/mutations";
import {
  DrivingSchoolProfileInput,
  drivingSchoolProfileFormSchema,
} from "@/validators/driving-school-profile";
import { AdminProfile } from "../types";

interface DrivingSchoolProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AdminProfile | null;
}

const DrivingSchoolProfileDialog = ({
  isOpen,
  onClose,
  initialData,
}: DrivingSchoolProfileDialogProps) => {
  const { refresh } = useRouter();
  const [updateAdminProfile, { loading }] = useMutation(UPDATE_ADMIN_PROFILE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DrivingSchoolProfileInput>({
    resolver: zodResolver(drivingSchoolProfileFormSchema),
    values: {
      drivingSchoolName: initialData?.drivingSchoolName || "",
      contactPerson: initialData?.contactPerson || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      country: initialData?.address?.country || "GERMANY",
      address: initialData?.address?.address || "",
      houseNumber: initialData?.address?.houseNumber || "",
      postalCode: initialData?.address?.postalCode
        ? String(initialData.address.postalCode)
        : "",
      city: initialData?.address?.city || "",
    },
  });

  const onSubmit = async (data: DrivingSchoolProfileInput) => {
    const {
      drivingSchoolName,
      contactPerson,
      phone,
      email,
      country,
      address: streetAddress,
      houseNumber,
      postalCode,
      city,
    } = data;

    const toastId = toast.loading("Updating Driving School Profile", {
      position: "bottom-left",
    });
    try {
      await updateAdminProfile({
        variables: {
          drivingSchoolName,
          contactPerson,
          phone,
          email,
          address: {
            country,
            address: streetAddress,
            houseNumber,
            postalCode: Number(postalCode),
            city,
          },
        },
        onCompleted: () => {
          toast.success("Driving School Profile Updated Successfully", {
            position: "bottom-left",
          });
          onClose();
          refresh();
        },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <div className="m-auto px-7 pt-6 pb-8">
        <div className="flex items-center justify-end">
          <ActionIcon size="sm" variant="text" onClick={onClose}>
            <XIcon className="w-6 h-6 text-black" strokeWidth={1.8} />
          </ActionIcon>
        </div>

        <div className="space-y-6">
          <div>
            <Title>Edit Driving School Profile</Title>
            <Text>Update your school and contact information.</Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "gap-4 sm:gap-6 grid sm:grid-cols-2 [&_label.block>span]:font-medium"
            )}
          >
            <Input
              label="Driving School Name"
              placeholder="Driving School Name"
              {...register("drivingSchoolName")}
              error={errors?.drivingSchoolName?.message}
            />
            <Input
              label="Contact Person"
              placeholder="Contact Person"
              {...register("contactPerson")}
              error={errors?.contactPerson?.message}
            />
            <Input
              label="Phone"
              placeholder="Phone"
              {...register("phone")}
              error={errors?.phone?.message}
            />
            <Input
              label="Email"
              placeholder="Email"
              type="email"
              {...register("email")}
              error={errors?.email?.message}
            />

            <div className="sm:col-span-2 space-y-2.5">
              <Title className="text-base">Address</Title>
              <div className="gap-4 sm:gap-6 grid sm:grid-cols-2">
                <Input
                  label="Address"
                  placeholder="Street"
                  {...register("address")}
                  error={errors?.address?.message}
                />
                <Input
                  label="House Number"
                  placeholder="House Number"
                  {...register("houseNumber")}
                  error={errors?.houseNumber?.message}
                />
                <Input
                  label="Postal Code"
                  placeholder="Postal Code"
                  {...register("postalCode")}
                  error={errors?.postalCode?.message}
                />
                <Input
                  label="City"
                  placeholder="City"
                  {...register("city")}
                  error={errors?.city?.message}
                />
                <Input
                  label="Country"
                  placeholder="Country"
                  {...register("country")}
                  error={errors?.country?.message}
                />
              </div>
            </div>

            <Button
              variant="solid"
              color="primary"
              type="submit"
              className="sm:col-span-2"
              disabled={loading}
              isLoading={loading}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default DrivingSchoolProfileDialog;
