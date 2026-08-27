import { ShieldCheck, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Text, Title } from "@/components/ui/text";
import { getS3FileUrl } from "@/lib/utils";
import { SepaMandate } from "../types";

interface SepaMandateCardProps {
  initialData: SepaMandate | null;
}

const formatSignedOn = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const SepaMandateCard = ({ initialData }: SepaMandateCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <Title className="text-lg">SEPA Mandate (Consent Form)</Title>
            <Text>Manage your SEPA mandate and consent form.</Text>
          </div>
        </div>

        {initialData && (
          <a
            href={getS3FileUrl(initialData.fileKey)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-medium items-center justify-center transition-colors duration-200 px-4 py-2 text-sm h-10 rounded-full bg-transparent border border-primary text-primary-dark hover:bg-primary-lighter/40 hover:border-primary-dark"
          >
            <Eye className="w-4 h-4 me-1.5" />
            View & Download
          </a>
        )}
      </div>

      {initialData ? (
        <>
          <div className="rounded-lg border border-gray-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Text className="font-semibold text-gray-900">Status</Text>
              <Badge
                color={initialData.status === "ACTIVE" ? "success" : "danger"}
                variant="flat"
              >
                {initialData.status === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">
                Mandate Reference
              </Text>
              <Text>{initialData.mandateReference}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">Version</Text>
              <Text>{initialData.version}</Text>
            </div>
            <div>
              <Text className="font-semibold text-gray-900">Signed On</Text>
              <Text>{formatSignedOn(initialData.signedOn)}</Text>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <Text>
              This mandate authorizes GuruBook to collect payments from your
              bank account.
            </Text>
            <Text>You can revoke this mandate at any time by contacting us.</Text>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <Text>No SEPA mandate has been added yet.</Text>
        </div>
      )}
    </div>
  );
};

export default SepaMandateCard;
