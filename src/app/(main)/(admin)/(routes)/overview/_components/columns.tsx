"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Tooltip } from "@/components/ui/tooltip";
import { ActionIcon } from "@/components/ui/action-icon";
import { Badge } from "@/components/ui/badge";
import { Progressbar } from "@/components/ui/progressbar";
import { EyeIcon } from "lucide-react";
import { UserT } from "../../users/types";

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
];

const getAvatarColor = (name: string) => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const isStudentActive = (student: UserT) => student.isVerified && student.status;

export const columns: ColumnDef<UserT>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const student = row.original;
      const fullName = `${student.firstName} ${student.lastName}`;
      return (
        <div className="flex items-center gap-3 pl-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(fullName)}`}
          >
            {getInitials(student.firstName, student.lastName)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{fullName}</div>
            <div className="text-xs text-gray-500">{student.email}</div>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "classes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class (Learning For)" />
    ),
    cell: ({ row }) => {
      const classes: string[] = row.getValue("classes");
      return (
        <div className="flex pl-2">{classes?.length ? classes.join(", ") : "-"}</div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      const progress: number = row.getValue("progress");
      return (
        <div className="pl-2 w-32 space-y-1">
          <span className="text-sm font-medium">{progress}%</span>
          <Progressbar value={progress} size="sm" color="primary" />
        </div>
      );
    },
  },
  {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const active = isStudentActive(row.original);
      return (
        <div className="pl-2">
          <Badge color={active ? "success" : "warning"} variant="flat">
            {active ? "Active" : "Waiting"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "lastLoginAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
    ),
    cell: ({ row }) => {
      const lastLoginAt: number | null = row.getValue("lastLoginAt");
      return (
        <div className="pl-2">
          {lastLoginAt
            ? new Date(lastLoginAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "Never"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-3">
          <Tooltip
            size="sm"
            content={() => "View Student"}
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
