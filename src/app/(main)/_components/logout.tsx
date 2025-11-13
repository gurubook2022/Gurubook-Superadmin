"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ActionIcon } from "@/components/ui/action-icon";
import { Text } from "@/components/ui/text";
import { LogOutIcon, XIcon } from "lucide-react";
import { signOut } from "next-auth/react";

const Logout = () => {
  const [modalState, setModalState] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setModalState(true)}
        variant="solid"
        color="danger"
        className="w-full"
      >
        <LogOutIcon className="mr-2" />
        Logout
      </Button>

      <Modal
        size="sm"
        className=""
        isOpen={modalState}
        onClose={() => setModalState(false)}
      >
        <div className="m-auto px-7 pt-6 pb-8 ">
          <div className=" flex items-center justify-end">
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setModalState(false)}
            >
              <XIcon className=" w-6 h-6 text-black" strokeWidth={1.8} />
            </ActionIcon>
          </div>

          <div className="space-y-4">
            <Text as="strong">Are you sure to logout?</Text>
            <Button
              type="submit"
              size="lg"
              color="danger"
              className="w-full"
              onClick={() => {
                signOut({ callbackUrl: "/sign-in" });
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Logout;
