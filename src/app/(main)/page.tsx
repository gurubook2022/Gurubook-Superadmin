import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0; // revalidate at most every hour

const page = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/sign-in");
  if (session?.user?.role === "ADMIN") redirect("/users");
  if (session?.user?.role === "SUPERADMIN") redirect("/dashboard");
};

export default page;
