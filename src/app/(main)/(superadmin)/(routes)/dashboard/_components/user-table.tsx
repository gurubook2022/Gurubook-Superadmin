import { DataTable } from "@/components/table/data-table";
import React from "react";
import { columns } from "./columns";
import { UserT } from "../types";

interface UserTableProps {
  users: UserT[];
}

const UserTable = ({ users }: UserTableProps) => {
  return (
    <DataTable
      heading="Users"
      filterKey={"email"}
      data={users}
      columns={columns}
    >
      <></>
      {/* <Link href={"/users/create"}>
        <Button variant="solid" color="primary" size="sm">
          Create user
        </Button>
      </Link> */}
    </DataTable>
  );
};

export default UserTable;
