import Link from "next/link";
import { Button } from "@/components/ui/button";
import Form from "./_components/form";
import { MoveLeftIcon } from "lucide-react";
import { getAdminDetails, getUserRegisterByAdmin } from "../actions";
import UserTable from "./_components/user-table";
import { UserT } from "../types";
import BackButton from "@/components/back-button";
import AdminPaymentDetails from "./_components/admin-payment-details";

export const revalidate = 0;
const page = async ({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) => {
  let response;
  if (slug === "create") {
    response = await getAdminDetails(slug);
  } else {
    response = await getUserRegisterByAdmin(slug);
  }

  return (
    <div className="space-y-4 relative">
      <BackButton />
      {slug === "create" && (
        <Form initialData={response?.data?.getAdminDetails || null} />
      )}
      {slug !== "create" && <AdminPaymentDetails adminId={slug} />}

      {slug !== "create" && (
        <>
          <UserTable
            users={(response?.data?.getUsersRegisteredByAdmin as UserT[]) || []}
          />
        </>
      )}
    </div>
  );
};

export default page;
