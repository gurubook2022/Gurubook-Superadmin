"use client";
import { MoveLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const { back, refresh } = useRouter();
  return (
    <Button
      size="sm"
      onClick={() => {
        back();
        refresh();
      }}
      variant="outline"
    >
      <MoveLeftIcon className="mr-2" />
      Back
    </Button>
  );
};

export default BackButton;
