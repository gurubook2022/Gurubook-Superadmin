import { Text, Title } from "@/components/ui/text";
import { MonthlyInvoiceT } from "../types";
import PreviousInvoiceCard from "./previous-invoice-card";

interface PreviousInvoicesSectionProps {
  invoices: MonthlyInvoiceT[];
}

const PreviousInvoicesSection = ({ invoices }: PreviousInvoicesSectionProps) => {
  return (
    <div className="space-y-4">
      <Title className="text-lg">Previous Invoices</Title>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-10 text-center">
            <Text>No previous invoices yet.</Text>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <PreviousInvoiceCard
              key={`${invoice.month}-${invoice.year}`}
              invoice={invoice}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousInvoicesSection;
