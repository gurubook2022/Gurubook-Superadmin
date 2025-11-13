"use client";
import { Button } from "@/components/ui/button";
import { ADMIN_PAYMENT_RECEIVED } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaymentReceivedButtonProps {
  amount: number;
}

const PaymentReceivedButton = ({ amount }: PaymentReceivedButtonProps) => {
  const { slug } = useParams();
  const { refresh } = useRouter();
  const [adminPaymentReceived, { loading }] = useMutation(
    ADMIN_PAYMENT_RECEIVED
  );

  const handleClick = async () => {
    adminPaymentReceived({
      variables: { adminId: slug },
      onCompleted: (adminPaymentReceived) => {
        toast.success("Payment Received Successfully", {
          position: "bottom-left",
        });
        refresh();
      },
      onError: () => {
        toast.error("Something Wrong", {
          position: "bottom-left",
        });
      },
    });
  };
  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={loading || amount === 0}
      isLoading={loading}
    >
      €{amount} Received
    </Button>
  );
};

export default PaymentReceivedButton;
