import { Text, Title } from "@/components/ui/text";
import CurrentInvoiceCard from "./_components/current-invoice-card";
import PreviousInvoicesSection from "./_components/previous-invoices-section";
import { getCurrentMonthlyInvoice, getPreviousMonthlyInvoices } from "./actions";
import { MonthlyInvoiceT } from "./types";

export const revalidate = 0; // revalidate at most every hour

const page = async () => {
  const [current, previous] = await Promise.all([
    getCurrentMonthlyInvoice(),
    getPreviousMonthlyInvoices(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Title>Billing & Invoices</Title>
        <Text>
          One cumulative invoice is created each month. It includes the list
          of all students added in that month.
        </Text>
      </div>
      <CurrentInvoiceCard
        invoice={current?.data?.getCurrentMonthlyInvoice as MonthlyInvoiceT}
      />
      <PreviousInvoicesSection
        invoices={
          (previous?.data?.getPreviousMonthlyInvoices as MonthlyInvoiceT[]) ||
          []
        }
      />
    </div>
  );
};

export default page;
