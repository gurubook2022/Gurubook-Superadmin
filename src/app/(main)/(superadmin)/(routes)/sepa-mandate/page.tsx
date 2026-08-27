import React from "react";
import { getSepaMandate } from "./action";
import Form from "./_components/form";
import { SepaMandateT } from "./types";

export const revalidate = 0;

const page = async () => {
  const response = await getSepaMandate();
  return (
    <div>
      <Form
        initialData={(response?.data?.getSepaMandate as SepaMandateT) || null}
      />
    </div>
  );
};

export default page;
