import { DataTable } from "@/components/table/data-table";
import { UserT } from "../types";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import Link from "next/link";

interface UserTableProps {
  users: UserT[];
}

const UserTable = ({ users }: UserTableProps) => {
  return (
    <div>
      <DataTable
        heading="Users"
        filterKey={"email"}
        data={users}
        columns={columns}
      >
        <Link href={"/users/create"}>
          <Button variant="solid" color="primary" size="sm">
            Create user
          </Button>
        </Link>
      </DataTable>
    </div>
  );
};

export default UserTable;
