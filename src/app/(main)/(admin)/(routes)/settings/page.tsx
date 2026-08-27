import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { getAdminProfile, getBankAccount, getSepaMandate } from "./actions";
import BankAccountCard from "./_components/bank-account-card";
import DrivingSchoolProfileCard from "./_components/driving-school-profile-card";
import SepaMandateCard from "./_components/sepa-mandate-card";
import AccountSecurityCard from "./_components/account-security-card";
import { Text, Title } from "@/components/ui/text";
import { AdminProfile, BankAccount, SepaMandate } from "./types";

export const revalidate = 0;

const page = async () => {
  const session = await getServerAuthSession();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const [bankAccountResponse, adminProfileResponse, sepaMandateResponse] =
    await Promise.all([getBankAccount(), getAdminProfile(), getSepaMandate()]);

  return (
    <div className="w-full space-y-6">
      <div>
        <Title>Settings</Title>
        <Text>
          Manage your driving school profile, payment details and consent
          form.
        </Text>
      </div>
      <DrivingSchoolProfileCard
        initialData={
          (adminProfileResponse?.data?.getAdminProfile as AdminProfile | null) ||
          null
        }
      />
      <BankAccountCard
        initialData={
          (bankAccountResponse?.data?.getBankAccount as BankAccount | null) ||
          null
        }
      />
      <SepaMandateCard
        initialData={
          (sepaMandateResponse?.data?.getSepaMandate as SepaMandate | null) ||
          null
        }
      />
      <AccountSecurityCard />
    </div>
  );
};

export default page;
