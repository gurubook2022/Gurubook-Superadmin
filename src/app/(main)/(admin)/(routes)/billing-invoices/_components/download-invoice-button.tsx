"use client";

import { Button } from "@/components/ui/button";
import { GENERATE_MONTHLY_INVOICE_PDF } from "@/graphql/mutations";
import { getS3FileUrl } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadInvoiceButtonProps {
  month: number;
  year: number;
  pdfKey: string | null;
}

const DownloadInvoiceButton = ({
  month,
  year,
  pdfKey,
}: DownloadInvoiceButtonProps) => {
  const [generateInvoicePdf, { loading }] = useMutation(
    GENERATE_MONTHLY_INVOICE_PDF
  );

  const handleClick = () => {
    if (pdfKey) {
      window.open(getS3FileUrl(pdfKey), "_blank");
      return;
    }

    generateInvoicePdf({
      variables: { month, year },
      onCompleted: (data) => {
        if (data?.generateMonthlyInvoicePdf) {
          window.open(getS3FileUrl(data.generateMonthlyInvoicePdf), "_blank");
        }
      },
      onError: () => {
        toast.error("Failed to generate invoice", { position: "bottom-left" });
      },
    });
  };

  return (
    <Button
      variant="solid"
      color="primary"
      size="sm"
      onClick={handleClick}
      isLoading={loading}
    >
      <DownloadIcon className="w-4 h-4 me-1.5" />
      Download Invoice (PDF)
    </Button>
  );
};

export default DownloadInvoiceButton;
