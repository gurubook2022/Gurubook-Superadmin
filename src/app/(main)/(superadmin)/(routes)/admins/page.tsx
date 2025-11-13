import AdminTable from "./_components/admin-table";
import { getAllAdmins } from "./actions";
import { AdminT } from "./types";

export const revalidate = 0; // revalidate at most every hour

const page = async () => {
  const response = await getAllAdmins();
  return (
    <AdminTable users={(response?.data?.getAllAdmins as AdminT[]) || []} />
  );
};

export default page;
