"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableViewOptionConent } from "./data-table-view-option-conent";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterKey: string;
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex-1 flex items-center justify-between">
      <div className="hidden sm:flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className=" w-[150px] lg:w-[250px]"
          clearable
          onClear={() => table.resetColumnFilters()}
        />
      </div>
      <DataTableViewOptions>
        <DataTableViewOptionConent table={table} />
      </DataTableViewOptions>
    </div>
  );
}
