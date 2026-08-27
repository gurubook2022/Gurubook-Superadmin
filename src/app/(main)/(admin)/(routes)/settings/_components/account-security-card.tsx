"use client";

import { useState } from "react";
import { Lock, KeyRound, ChevronRight } from "lucide-react";
import { Text, Title } from "@/components/ui/text";
import ChangePasswordDialog from "./change-password-dialog";

const AccountSecurityCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <Title className="text-lg">Account & Security</Title>
          <Text>Manage your account security.</Text>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="w-full flex items-center gap-4 rounded-lg border border-gray-100 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-lighter text-primary shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <Text className="font-semibold text-gray-900">
            Change Password
          </Text>
          <Text>Update your account password</Text>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
      </button>

      <ChangePasswordDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default AccountSecurityCard;
