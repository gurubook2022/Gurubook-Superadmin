import React from "react";
import QuestionTable from "./_components/question-table";
import { getAllQuestions } from "./[slug]/[questiontype]/actions";
import { QuestionT } from "./[slug]/[questiontype]/types";
import BackButton from "@/components/back-button";

export const revalidate = 0;

const page = async ({
  params: { type },
}: {
  params: { type: "bkf" | "dl" };
}) => {
  const response = await getAllQuestions(type.toUpperCase());
  return (
    <div className="space-y-4">
      <BackButton />
      <QuestionTable
        type={type}
        questions={
          response?.data?.getQuestions
            ? (JSON.parse(response?.data?.getQuestions!) as QuestionT[])
            : []
        }
      />
    </div>
  );
};

export default page;
