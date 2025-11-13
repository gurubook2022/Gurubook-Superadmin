"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Tooltip } from "@/components/ui/tooltip";
import { ActionIcon } from "@/components/ui/action-icon";
import { EyeIcon } from "lucide-react";
import { PaymentT, UserT } from "../types";
import Link from "next/link";
import { LANGUAGES } from "@/constants/languages";
import { toFixed } from "@/lib/utils";

export const columns: ColumnDef<UserT>[] = [
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
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center pl-2">{row.getValue("role")}</div>
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
    accessorKey: "payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const payment: PaymentT = row.getValue("payment"); // Get the nested payment object
      return (
        <div className="flex  pl-2 items-center">
          {payment ? `€ ${toFixed(payment?.amount)}` : "-"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      const payment: PaymentT = row.getValue("payment"); // Get the nested payment object
      return (
        <div className="flex  pl-2 items-center">
          {payment ? payment?.method : "-"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "examLanguage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exam Language" />
    ),
    cell: ({ row }) => {
      const languageCode = row.getValue("examLanguage");
      const language = LANGUAGES?.find(
        (language) => language?.code === languageCode
      );

      return <div className="flex  pl-2 items-center">{language?.title}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "learningLanguage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Learning Language" />
    ),
    cell: ({ row }) => {
      const languageCode = row.getValue("learningLanguage");
      const language = LANGUAGES?.find(
        (language) => language?.code === languageCode
      );

      return <div className="flex  pl-2 items-center">{language?.title}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-3">
          <Tooltip
            size="sm"
            content={() => "View User"}
            placement="top"
            color="invert"
          >
            <Link href={`/users/${row?.original?._id}`}>
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
