"use client";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { ActionIcon } from "@/components/ui/action-icon";
import { Title, Text } from "@/components/ui/text";
import { Password } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, handleGraphqlErrors } from "@/lib/utils";
import { CHANGE_PASSWORD } from "@/graphql/mutations";
import {
  ChangePasswordInput,
  changePasswordFormSchema,
} from "@/validators/change-password";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog = ({
  isOpen,
  onClose,
}: ChangePasswordDialogProps) => {
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChangePasswordInput) => {
    const { currentPassword, newPassword } = data;
    const toastId = toast.loading("Updating Password", {
      position: "bottom-left",
    });
    try {
      await changePassword({
        variables: { currentPassword, newPassword },
        onCompleted: () => {
          toast.success("Password Updated Successfully", {
            position: "bottom-left",
          });
          handleClose();
        },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
      <div className="m-auto px-7 pt-6 pb-8">
        <div className="flex items-center justify-end">
          <ActionIcon size="sm" variant="text" onClick={handleClose}>
            <XIcon className="w-6 h-6 text-black" strokeWidth={1.8} />
          </ActionIcon>
        </div>

        <div className="space-y-6">
          <div>
            <Title>Change Password</Title>
            <Text>Update your account password.</Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("space-y-4 [&_label.block>span]:font-medium")}
          >
            <Password
              label="Current Password"
              placeholder="Current Password"
              {...register("currentPassword")}
              error={errors?.currentPassword?.message}
            />
            <Password
              label="New Password"
              placeholder="New Password"
              {...register("newPassword")}
              error={errors?.newPassword?.message}
            />
            <Password
              label="Re-enter New Password"
              placeholder="Re-enter New Password"
              {...register("confirmNewPassword")}
              error={errors?.confirmNewPassword?.message}
            />

            <Button
              variant="solid"
              color="primary"
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordDialog;
