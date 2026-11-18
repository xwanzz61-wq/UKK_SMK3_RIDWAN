import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.account.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      redirect("/admin/login?error=Email atau password salah");
    }

    const cookieStore = await cookies();
    cookieStore.set("isLoggedIn", "true", {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    redirect("/admin");
  }

  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SMK MVP</h1>
          <p className="text-gray-500 mt-2">Silakan login ke akun Anda</p>
        </div>
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm text-center">
            {errorMessage}
          </div>
        )}
        <form action={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
