import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Toast from "@/providers/toast";

import GlobalDrawer from "@/components/drawer/container";
import "./globals.css";
import { getServerAuthSession } from "@/lib/auth";
import AuthSession from "@/providers/auth-session";
import Graphql from "@/providers/graphql";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gurubook",
  description: "Gurubook",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSession session={session}>
          <Graphql>
            <GlobalDrawer />
            <Toast />
            {/* children */}
            {children}
          </Graphql>
        </AuthSession>
      </body>
    </html>
  );
}
