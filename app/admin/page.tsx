import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  if (!cookieStore.get("isLoggedIn")) {
    redirect("/admin/login");
  }

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("isLoggedIn");
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-white border-r p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">UKKSMT4</h1>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block p-3 rounded bg-blue-600 text-white"
            >
              Dashboard Admin
            </Link>
            <Link
              href="/usermanagement"
              className="block p-3 rounded text-gray-600 hover:bg-gray-100"
            >
              User Management
            </Link>
          </nav>
        </div>
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full bg-red-100 text-red-600 p-3 rounded font-semibold hover:bg-red-200 transition"
          >
            Logout
          </button>
        </form>
      </aside>
      <main className="flex-1">
        <header className="bg-white border-b p-5">
          <h2 className="font-semibold">Dashboard Admin</h2>
        </header>
      </main>
    </div>
  );
}