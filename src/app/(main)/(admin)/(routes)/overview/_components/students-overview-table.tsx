import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { UserT } from "../../users/types";
import { columns } from "./columns";

interface StudentsOverviewTableProps {
  students: UserT[];
}

const StudentsOverviewTable = ({ students }: StudentsOverviewTableProps) => {
  return (
    <div>
      <DataTable
        heading="Students"
        filterKey="firstName"
        data={students}
        columns={columns}
        itemsLabel="students"
      >
        <Link href="/users/create">
          <Button variant="solid" color="primary" size="sm">
            <PlusIcon className="w-4 h-4 me-1.5" />
            Add New Student
          </Button>
        </Link>
      </DataTable>
    </div>
  );
};

export default StudentsOverviewTable;
