"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ActionIcon } from "@/components/ui/action-icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Title, Text } from "@/components/ui/text";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

interface StudentCredentialsDialogProps {
  isOpen: boolean;
  email: string;
  password: string;
  onClose: () => void;
}

type CopiedField = "email" | "password" | "both" | null;

const StudentCredentialsDialog = ({
  isOpen,
  email,
  password,
  onClose,
}: StudentCredentialsDialogProps) => {
  const [copiedField, setCopiedField] = useState<CopiedField>(null);

  const handleCopy = async (field: CopiedField, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success("Copied to clipboard", { position: "bottom-left" });
      setTimeout(() => {
        setCopiedField((current) => (current === field ? null : current));
      }, 2000);
    } catch {
      toast.error("Could not copy to clipboard", { position: "bottom-left" });
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
            <Title>Student Account Created</Title>
            <Text>
              Share these login details with the student so they can sign in
              to GuruBook. This password will not be shown again.
            </Text>
          </div>

          <div className="space-y-4">
            <Input
              label="Email"
              value={email}
              readOnly
              suffix={
                <button
                  type="button"
                  onClick={() => handleCopy("email", email)}
                  className="text-gray-500 hover:text-primary"
                  aria-label="Copy email"
                >
                  {copiedField === "email" ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </button>
              }
            />
            <Input
              label="Password"
              value={password}
              readOnly
              suffix={
                <button
                  type="button"
                  onClick={() => handleCopy("password", password)}
                  className="text-gray-500 hover:text-primary"
                  aria-label="Copy password"
                >
                  {copiedField === "password" ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                handleCopy("both", `Email: ${email}\nPassword: ${password}`)
              }
            >
              {copiedField === "both" ? "Copied!" : "Copy Both"}
            </Button>
            <Button
              type="button"
              variant="solid"
              color="primary"
              className="w-full"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StudentCredentialsDialog;
