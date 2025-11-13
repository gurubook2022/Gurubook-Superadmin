import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Select from "../ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center space-x-6 justify-between lg:space-x-8">
      <div className="flex flex-col sm:flex-row  items-start gap-2 sm:items-center  sm:flex-1">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          size="sm"
          variant="flat"
          value={`${table.getState().pagination.pageSize}`}
          onChange={(value: { name: string; value: number }) => {
            table.setPageSize(value.value);
          }}
          options={[
            { name: "5", value: 5 },
            { name: "10", value: 10 },
            { name: "20", value: 20 },
            { name: "30", value: 30 },
            { name: "40", value: 40 },
            { name: "50", value: 50 },
          ]}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center items-end justify-end gap-2 sm:gap-8 flex-1">
        <div className="flex w-auto items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
