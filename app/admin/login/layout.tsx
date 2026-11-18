export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("isLoggedIn");

  if (isLoggedIn) {
    redirect("/admin");
  }

  return <>{children}</>;
}