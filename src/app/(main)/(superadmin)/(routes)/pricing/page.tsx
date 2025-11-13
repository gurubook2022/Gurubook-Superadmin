import React from "react";
import { getPrice } from "./action";
import Form from "./_components/form";

export const revalidate = 0;

const page = async () => {
  const prices = await getPrice();
  return (
    <div>
      <Form initialData={prices?.data?.getPrices} />
    </div>
  );
};

export default page;
