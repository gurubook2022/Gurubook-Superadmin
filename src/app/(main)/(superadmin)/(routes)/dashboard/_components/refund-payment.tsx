import { REFUND_PAYMENT } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import React from "react";
import { Button } from "rizzui";

interface RefundPaymentProps {
  createdAt: number;
}

const RefundPayment = ({ createdAt }: RefundPaymentProps) => {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const difference = now.getTime() - createdDate.getTime();

  const differenceInDays: number = difference / (1000 * 60 * 60 * 24);

  const [refundPayment] = useMutation(REFUND_PAYMENT);

  const handleClick = async () => {
    await refundPayment({
      variables: {
        paymentId: "pi_3PPVdyBPVbbMqI9T2jSkNIXE",
      },
    });
  };
  return (
    <div>
      <Button onClick={handleClick} disabled={differenceInDays > 14} size="sm">
        Refund
      </Button>
    </div>
  );
};

export default RefundPayment;
