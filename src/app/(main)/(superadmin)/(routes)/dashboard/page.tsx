import { getAllUsers } from "./actions";
import UserTable from "./_components/user-table";
import { UserT } from "./types";
import Button from "./_components/button";

export const revalidate = 0;
const page = async () => {
  const response = await getAllUsers();

  return (
    <div className="space-y-4">
      <UserTable users={(response?.data?.getAllUsers as UserT[]) || []} />
      {/* {JSON.stringify(response?.data?.getAllUsers)} */}
      {/* <Button /> */}
    </div>
  );
};

export default page;
