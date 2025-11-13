import { DataTable } from "@/components/table/data-table";
import { AdminT } from "../types";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import Link from "next/link";

interface AdminTableProps {
  users: AdminT[];
}

const AdminTable = ({ users }: AdminTableProps) => {
  return (
    <div>
      <DataTable
        heading="Admins"
        filterKey={"email"}
        data={users}
        columns={columns}
      >
        <Link href={"/admins/create"}>
          <Button variant="solid" color="primary" size="sm">
            Create Admin
          </Button>
        </Link>
      </DataTable>
    </div>
  );
};

export default AdminTable;
