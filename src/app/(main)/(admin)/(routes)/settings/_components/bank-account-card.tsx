"use client";

import { useState } from "react";
import { Landmark, Pencil, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Text, Title } from "@/components/ui/text";
import { BankAccount } from "../types";
import BankAccountDialog from "./bank-account-dialog";

interface BankAccountCardProps {
  initialData: BankAccount | null;
}

const BankAccountCard = ({ initialData }: BankAccountCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <Title className="text-lg">SEPA Direct Debit</Title>
            <Text>Manage how you receive payments.</Text>
          </div>
        </div>

        {initialData && (
          <Button
            variant="outline"
            color="primary"
            rounded="pill"
            onClick={() => setDialogOpen(true)}
          >
            <Pencil className="w-4 h-4 me-1.5" />
            Edit
          </Button>
        )}
      </div>

      {initialData ? (
        <>
          <Badge color="success" variant="flat">
            Active
          </Badge>

          <div className="rounded-lg border border-gray-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Text className="font-semibold text-gray-900">
                Account Holder
              </Text>
              <Text>{initialData.accountHolder}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">IBAN</Text>
              <Text>{initialData.iban}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">BIC</Text>
              <Text>{initialData.bic}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">Bank</Text>
              <Text>{initialData.bankName}</Text>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4 shrink-0" />
            Invoices are paid to your bank account via SEPA Direct Debit.
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <Text>You haven&apos;t added your bank account details yet.</Text>
          <Button onClick={() => setDialogOpen(true)}>
            Add Bank Account
          </Button>
        </div>
      )}

      <BankAccountDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={initialData}
      />
    </div>
  );
};

export default BankAccountCard;
