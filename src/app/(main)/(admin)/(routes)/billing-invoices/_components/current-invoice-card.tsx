import { FileTextIcon, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Text, Title } from "@/components/ui/text";
import { toFixed } from "@/lib/utils";
import { MonthlyInvoiceT } from "../types";
import DownloadInvoiceButton from "./download-invoice-button";
import StudentsTable from "./students-table";

interface CurrentInvoiceCardProps {
  invoice: MonthlyInvoiceT | null | undefined;
}

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const CurrentInvoiceCard = ({ invoice }: CurrentInvoiceCardProps) => {
  if (!invoice) {
    return (
      <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <Text>Current invoice could not be loaded.</Text>
        </div>
      </div>
    );
  }

  const monthName = invoice.periodLabel.split(" ")[0];

  return (
    <>
      <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Title className="text-lg">Current Invoice</Title>
                <Badge color="warning" variant="flat">
                  Open
                </Badge>
              </div>
              <Title className="text-xl mt-1">{invoice.periodLabel}</Title>
              {invoice.finalizedOn && (
                <Text>
                  Invoice will be finalized on {formatDate(invoice.finalizedOn)}.
                </Text>
              )}
            </div>
          </div>

          <DownloadInvoiceButton
            month={invoice.month}
            year={invoice.year}
            pdfKey={invoice.pdfKey}
          />
        </div>

        <div className="rounded-lg border border-gray-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Text className="font-semibold text-gray-900">
              Students Added
            </Text>
            <Text>{invoice.studentsCount}</Text>
          </div>
          <div>
            <Text className="font-semibold text-gray-900">Net Amount</Text>
            <Text>€ {toFixed(invoice.netAmount)}</Text>
          </div>
          <div>
            <Text className="font-semibold text-gray-900">
              VAT ({toFixed(invoice.vatPercentage)}%)
            </Text>
            <Text>
              € {toFixed(invoice.totalAmount - invoice.netAmount)}
            </Text>
          </div>
          <div>
            <Text className="font-semibold text-gray-900">
              Current Total
            </Text>
            <Text className="text-primary font-semibold">
              € {toFixed(invoice.totalAmount)}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="w-4 h-4 shrink-0" />
          This invoice is cumulative. All students added in {monthName} are
          included.
        </div>
      </div>

      <StudentsTable
        title="Students in this Invoice"
        students={invoice.students}
      />
    </>
  );
};

export default CurrentInvoiceCard;
