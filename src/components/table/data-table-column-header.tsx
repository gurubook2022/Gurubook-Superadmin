import {
  MoveDownIcon,
  MoveUpIcon,
  ChevronsUpDownIcon,
  EyeIcon,
} from "lucide-react";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMedia } from "@/hooks/use-media";
import { Popover } from "../ui/popover";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [isOpen, setIsOpen] = useState(false);
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      // @ts-ignore
      content={({}) => (
        <div className="flex flex-col min-w-32 gap-1">
          <Button
            size="sm"
            variant="flat"
            className="  font-medium justify-start "
            onClick={() => {
              column.toggleSorting(false);
              setIsOpen(false);
            }}
          >
            <MoveUpIcon className="mr-2 h-3.5 w-3.5 " />
            Asc
          </Button>
          <Button
            size="sm"
            variant="flat"
            className="  font-medium justify-start "
            onClick={() => {
              column.toggleSorting(true);
              setIsOpen(false);
            }}
          >
            <MoveDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </Button>
          <hr />
          <Button
            size="sm"
            variant="flat"
            className="  font-medium justify-start "
            onClick={() => {
              column.toggleVisibility(false);
              setIsOpen(false);
            }}
          >
            <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </Button>
        </div>
      )}
      shadow="sm"
      placement={isMobile ? "bottom" : "bottom-start"}
      className="z-50 p-1 rounded-md bg-white [&>svg]:hidden [&>svg]:dark:fill-gray-100 sm:[&>svg]:inline-flex"
    >
      <Button
        size="sm"
        color="primary"
        className=" h-8 bg-transparent data-[state=open]:bg-[#F4F4F5]/30 "
      >
        <span className="w-max">{title}</span>
        {column.getIsSorted() === "desc" ? (
          <MoveDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <MoveUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </Popover>
  );
}
