"use client";

import { ColumnDef, Row } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Tooltip } from "@/components/ui/tooltip";
import { ActionIcon } from "@/components/ui/action-icon";
import { EyeIcon } from "lucide-react";
import { QuestionT, QuestionData } from "../[slug]/[questiontype]/types";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export const columns: ColumnDef<QuestionT>[] = [
  {
    accessorKey: "questionType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center pl-2 w-max">
          {row.getValue("questionType")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "questionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex pl-2">
          <span className="max-w-[500px]  font-medium">
            {row?.getValue("questionNumber")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "questionData",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question Title (en)" />
    ),
    cell: ({ row }) => {
      const questionData: QuestionData[] = row.getValue("questionData");
      return (
        <div className="flex  pl-2 items-center w-max">
          {questionData
            ? questionData[0]?.title.length > 30
              ? `${questionData[0]?.title?.slice(0, 30)} ...`
              : questionData[0]?.title
            : "-"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (<ViewQuestionLink row={row} />
      );
    },
  },
];



const ViewQuestionLink = ({ row }: { row: Row<QuestionT> }) => {
  const params = useParams()

  return <div className="flex items-center justify-center gap-3">
    <Tooltip
      size="sm"
      content={() => "View Question"}
      placement="top"
      color="invert"
    >
      <Link
        href={`/questions/${params?.type}/${row?.original?._id}/${(
          row.getValue("questionType") as string
        )?.replace(" ", "-")}?lang=en`}
      >
        <ActionIcon
          tag="span"
          size="sm"
          variant="outline"
          className="hover:!border-gray-900 hover:text-gray-700"
        >
          <EyeIcon className="h-4 w-4" />
        </ActionIcon>
      </Link>
    </Tooltip>
  </div>
}