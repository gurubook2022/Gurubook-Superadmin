import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Select from "../ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  itemsLabel?: string;
}

type PageToken = number | "ellipsis";

const getPageTokens = (current: number, total: number): PageToken[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const tokens: PageToken[] = [1];
  if (current > 3) tokens.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) tokens.push(i);

  if (current < total - 2) tokens.push("ellipsis");
  tokens.push(total);

  return tokens;
};

export function DataTablePagination<TData>({
  table,
  itemsLabel = "results",
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageTokens = getPageTokens(pageIndex + 1, pageCount);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:items-center">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          size="sm"
          variant="flat"
          value={`${pageSize}`}
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

      <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-4">
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {totalRows === 0
            ? `No ${itemsLabel}`
            : `Showing ${startRow} to ${endRow} of ${totalRows} ${itemsLabel}`}
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

          {pageTokens.map((token, index) =>
            token === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={token}
                type="button"
                onClick={() => table.setPageIndex(token - 1)}
                className={cn(
                  "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
                  token === pageIndex + 1
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-gray-0 text-gray-700 hover:border-primary"
                )}
              >
                {token}
              </button>
            )
          )}

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
