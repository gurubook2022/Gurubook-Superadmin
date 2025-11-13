import { DataTable } from "@/components/table/data-table";
import { QuestionT } from "../[slug]/[questiontype]/types";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import Link from "next/link";

interface QuestionTableProps {
  type: "bkf" | "dl";
  questions: QuestionT[];
}

const QuestionTable = ({ questions, type }: QuestionTableProps) => {
  return (
    <div>
      <DataTable
        heading={`${type === "bkf" ? "BKF" : "DL"} Questions`}
        filterKey={"questionNumber"}
        data={questions}
        columns={columns}
      >
        <Link href={`/questions/${type}/create`}>
          <Button variant="solid" color="primary" size="sm">
            Create Question
          </Button>
        </Link>
      </DataTable>
    </div>
  );
};

export default QuestionTable;
