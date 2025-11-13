import { getAdminPayments } from "../../actions";
import { AdminPaymentT } from "../../types";
import PaymentReceivedButton from "./payment-received-button";

interface AdminPaymentDetails {
  adminId: string;
}
const AdminPaymentDetails = async ({ adminId }: AdminPaymentDetails) => {
  const adminPaymentsDetails: [AdminPaymentT] = await getAdminPayments(adminId);
  return (
    <div className="absolute top-0 right-0 !mt-0">
      <PaymentReceivedButton
        amount={adminPaymentsDetails?.reduce(
          (acc, currentObject) => acc + currentObject?.amount,
          0
        )}
      />
    </div>
  );
};

export default AdminPaymentDetails;
