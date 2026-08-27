"use client";

import { ChevronDown, ChevronUp, FileTextIcon } from "lucide-react";
import { Collapse } from "@/components/ui/collapse";
import { Badge } from "@/components/ui/badge";
import { Text, Title } from "@/components/ui/text";
import { toFixed } from "@/lib/utils";
import { MonthlyInvoiceT } from "../types";
import DownloadInvoiceButton from "./download-invoice-button";
import StudentsTable from "./students-table";

interface PreviousInvoiceCardProps {
  invoice: MonthlyInvoiceT;
  defaultOpen?: boolean;
}

const PreviousInvoiceCard = ({
  invoice,
  defaultOpen,
}: PreviousInvoiceCardProps) => {
  return (
    <Collapse
      defaultOpen={defaultOpen}
      className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      panelClassName="px-6 pb-6"
      header={({ open, toggle }) => (
        <div
          role="button"
          onClick={toggle}
          className="flex items-center justify-between gap-4 p-6 flex-wrap cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <Title className="text-lg">{invoice.periodLabel}</Title>
              <Badge color="success" variant="flat">
                Paid
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <Text className="font-semibold text-gray-900">Students</Text>
              <Text>{invoice.studentsCount}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">Net</Text>
              <Text>€ {toFixed(invoice.netAmount)}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">
                VAT ({toFixed(invoice.vatPercentage)}%)
              </Text>
              <Text>€ {toFixed(invoice.totalAmount - invoice.netAmount)}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">Total</Text>
              <Text className="text-primary font-semibold">
                € {toFixed(invoice.totalAmount)}
              </Text>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <DownloadInvoiceButton
                month={invoice.month}
                year={invoice.year}
                pdfKey={invoice.pdfKey}
              />
            </div>

            {open ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      )}
    >
      <StudentsTable
        title={`Students in this Invoice (${invoice.periodLabel})`}
        students={invoice.students}
        bordered={false}
      />
    </Collapse>
  );
};

export default PreviousInvoiceCard;
