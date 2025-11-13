import { Checkbox } from "../ui/checkbox";
import { Title } from "../ui/text";
import { Table } from "@tanstack/react-table";

interface DataTableViewOptionConent<TData> {
  table: Table<TData>;
}

export function DataTableViewOptionConent<TData>({
  table,
}: DataTableViewOptionConent<TData>) {
  return (
    <div className="flex flex-col min-w-32 gap-1 py-1.5 px-2">
      <Title as="h6" className="mb-1 text-sm font-semibold">
        Toggle Columns
      </Title>

      <div className="flex flex-col gap-1">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <Checkbox
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onChange={(event) => {
                  column.toggleVisibility(event.target.checked);
                }}
                label={column.id}
              />
            );
          })}
      </div>
    </div>
  );
}
