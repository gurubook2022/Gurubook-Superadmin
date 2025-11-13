import UserTable from "./_components/user-table";
import { getUserRegisterByAdmin } from "./actions";
import { UserT } from "./types";

export const revalidate = 0; // revalidate at most every hour

const page = async () => {
  const response = await getUserRegisterByAdmin();

  return (
    <UserTable
      users={(response?.data?.getUsersRegisteredByAdmin as UserT[]) || []}
    />
  );
};

export default page;
