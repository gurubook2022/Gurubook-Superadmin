"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Tooltip } from "@/components/ui/tooltip";
import { ActionIcon } from "@/components/ui/action-icon";
import { EyeIcon } from "lucide-react";
import { AdminT } from "../types";
import Link from "next/link";

export const columns: ColumnDef<AdminT>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center pl-2">{row.getValue("email")}</div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex pl-2">
          <span className="max-w-[500px]  font-medium">
            {row.getValue("firstName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  pl-2 items-center">
          {row.getValue("lastName")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    // accessorKey: "id",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-3">
          {/* <EditUser user={row.original} /> */}
          <Tooltip
            size="sm"
            content={() => "View Admin"}
            placement="top"
            color="invert"
          >
            <Link href={`/admins/${row?.original?._id}`}>
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
      );
    },
  },
];
