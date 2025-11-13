import { Button } from "@/components/ui/button";
import { ActionIcon } from "@/components/ui/action-icon";
import { DELETE_ADMIN } from "@/graphql/mutations";
import { Title, Text } from "@/components/ui/text";
import { useMutation } from "@apollo/client";
import { TrashIcon, XIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { useState } from "react";
import { handleGraphqlErrors } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { revalidatePath } from "next/cache";

interface DeleteButtonProps {
  _id: string;
}

const DeleteButton = ({ _id }: DeleteButtonProps) => {
  const { refresh, push } = useRouter();
  const [modalState, setModalState] = useState(false);
  // Delete Mutation
  const [deleteAdmin, { loading: deleteLoading }] = useMutation(DELETE_ADMIN, {
    onCompleted: () => {
      toast.success("Admin Deleted Successfully", {
        position: "bottom-left",
      });

      push("/admins");
      refresh();
    },
  });

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting Admin", {
      position: "bottom-left",
    });
    try {
      await deleteAdmin({
        variables: { _id },
      });
    } catch (error: any) {
      handleGraphqlErrors(error);
    } finally {
      toast.dismiss(toastId);
    }
  };
  return (
    <>
      <Button onClick={() => setModalState(true)} size="sm" color="danger">
        <TrashIcon className="w-4 h-4" />
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

          <div className="space-y-6">
            <div>
              <Title>Delete Admin</Title>
              <Text>You are going to delete the admin. Are you sure?</Text>
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="w-full"
                disabled={deleteLoading}
                onClick={() => setModalState(false)}
              >
                No, Keep it.
              </Button>
              <Button
                type="submit"
                size="lg"
                color="danger"
                className="w-full"
                disabled={deleteLoading}
                isLoading={deleteLoading}
                onClick={handleDelete}
              >
                Yes, Delete!
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteButton;
