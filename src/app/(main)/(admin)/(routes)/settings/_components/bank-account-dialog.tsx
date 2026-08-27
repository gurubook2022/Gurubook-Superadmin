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
import { UPSERT_BANK_ACCOUNT } from "@/graphql/mutations";
import {
  BankAccountInput,
  bankAccountFormSchema,
} from "@/validators/bank-account";
import { BankAccount } from "../types";

interface BankAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BankAccount | null;
}

const BankAccountDialog = ({
  isOpen,
  onClose,
  initialData,
}: BankAccountDialogProps) => {
  const { refresh } = useRouter();
  const [upsertBankAccount, { loading }] = useMutation(UPSERT_BANK_ACCOUNT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountFormSchema),
    values: {
      accountHolder: initialData?.accountHolder || "",
      iban: initialData?.iban || "",
      bic: initialData?.bic || "",
      bankName: initialData?.bankName || "",
    },
  });

  const onSubmit = async (data: BankAccountInput) => {
    const toastId = toast.loading(
      initialData ? "Updating Bank Account" : "Adding Bank Account",
      { position: "bottom-left" }
    );
    try {
      await upsertBankAccount({
        variables: data,
        onCompleted: () => {
          toast.success(
            initialData
              ? "Bank Account Updated Successfully"
              : "Bank Account Added Successfully",
            { position: "bottom-left" }
          );
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
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <div className="m-auto px-7 pt-6 pb-8">
        <div className="flex items-center justify-end">
          <ActionIcon size="sm" variant="text" onClick={onClose}>
            <XIcon className="w-6 h-6 text-black" strokeWidth={1.8} />
          </ActionIcon>
        </div>

        <div className="space-y-6">
          <div>
            <Title>
              {initialData ? "Edit Bank Account" : "Add Bank Account"}
            </Title>
            <Text>
              {initialData
                ? "Update your bank account details."
                : "Add your bank account details to receive payments."}
            </Text>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("space-y-4 [&_label.block>span]:font-medium")}
          >
            <Input
              label="Account Holder"
              placeholder="Account Holder"
              {...register("accountHolder")}
              error={errors?.accountHolder?.message}
            />
            <Input
              label="IBAN"
              placeholder="IBAN"
              {...register("iban")}
              error={errors?.iban?.message}
            />
            <Input
              label="BIC"
              placeholder="BIC"
              {...register("bic")}
              error={errors?.bic?.message}
            />
            <Input
              label="Bank"
              placeholder="Bank Name"
              {...register("bankName")}
              error={errors?.bankName?.message}
            />

            <Button
              variant="solid"
              color="primary"
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              {initialData ? "Update" : "Add"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default BankAccountDialog;
