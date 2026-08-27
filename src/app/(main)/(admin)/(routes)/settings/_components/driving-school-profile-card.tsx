"use client";

import { useState } from "react";
import { Store, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/text";
import { AdminProfile } from "../types";
import DrivingSchoolProfileDialog from "./driving-school-profile-dialog";

interface DrivingSchoolProfileCardProps {
  initialData: AdminProfile | null;
}

const Field = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <Text className="font-semibold text-gray-900">{label}</Text>
    <Text>{value || "-"}</Text>
  </div>
);

const DrivingSchoolProfileCard = ({
  initialData,
}: DrivingSchoolProfileCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-lighter text-primary shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <Title className="text-lg">Driving School Profile</Title>
            <Text>Your school and contact information.</Text>
          </div>
        </div>

        <Button
          variant="outline"
          color="primary"
          rounded="pill"
          onClick={() => setDialogOpen(true)}
        >
          <Pencil className="w-4 h-4 me-1.5" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field
            label="Driving School Name"
            value={initialData?.drivingSchoolName}
          />
          <Field label="Partner ID" value={initialData?.partnerId} />
          <Field label="Contact Person" value={initialData?.contactPerson} />
          <Field label="Phone" value={initialData?.phone} />
        </div>
        <div className="space-y-4">
          <Field label="Email" value={initialData?.email} />
          <Field
            label="Address"
            value={
              initialData?.address && (
                <>
                  {initialData.address.address} {initialData.address.houseNumber},{" "}
                  {initialData.address.postalCode}
                  <br />
                  {initialData.address.city}, {initialData.address.country}
                </>
              )
            }
          />
        </div>
      </div>

      <DrivingSchoolProfileDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={initialData}
      />
    </div>
  );
};

export default DrivingSchoolProfileCard;
