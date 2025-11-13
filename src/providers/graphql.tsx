"use client";
import client from "@/graphql";
import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

const Graphql = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Graphql;
