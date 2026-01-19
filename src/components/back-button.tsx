"use client";
import { MoveLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const BackButton = () => {
  const param = useParams()

  const { push, refresh } = useRouter();
  return (
    <Button
      size="sm"
      onClick={() => {
        push(`/questions/${param.type}`);
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
