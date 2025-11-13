"use client";

import { Popover } from "../ui/popover";

import { Button } from "../ui/button";
import { useState } from "react";
import { useMedia } from "@/hooks/use-media";
import { ArrowDownWideNarrow } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  children: React.ReactNode;
}

export function DataTableViewOptions<TData>({
  children,
}: DataTableViewOptionsProps<TData>) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      // @ts-ignore
      content={() => children}
      shadow="sm"
      placement={isMobile ? "bottom" : "bottom-start"}
      className="z-50 p-1 rounded-md bg-white [&>svg]:hidden [&>svg]:dark:fill-gray-100 sm:[&>svg]:inline-flex"
    >
      <Button variant="outline" size="sm" className="ml-auto  h-8 flex">
        <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
        View
      </Button>
    </Popover>
  );
}
