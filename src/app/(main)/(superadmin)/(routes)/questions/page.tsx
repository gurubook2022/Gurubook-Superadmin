import { CarIcon, TruckIcon } from "lucide-react";

import { Title, Text } from "@/components/ui/text";
import Link from "next/link";

const page = async () => {
  return (
    <div className="flex flex-col sm:flex-row text-center gap-20 h-full items-center justify-center">
      <Link
        href={"/questions/dl"}
        className="flex flex-col items-center  justify-center"
      >
        <CarIcon className="w-20 h-20" />
        <Title className="text-gray-700">Driving License</Title>
      </Link>
      <Link
        href={"questions/bkf"}
        className="flex flex-col items-center justify-center"
      >
        <TruckIcon className="w-20 h-20" />
        <Title className="text-gray-700">BKF</Title>
      </Link>
    </div>
  );
};

export default page;
