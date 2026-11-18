
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      <header className="fixed top-5 left-0 z-50 w-full px-5">
        <nav className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-8 py-4 shadow-lg">

          <h1 className="text-xl font-bold text-blue-600">
            SMK MVP
          </h1>

          <Link
            href="/admin/login"
            className="rounded-full bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

        </nav>
      </header>

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">

        <h2 className="text-4xl font-bold text-gray-800">
          WELCOME TO SMK MVP
        </h2>

        <h1>Ridwan Setiawan adalah pro player epep dan penguasa jumsot gaya helikopter well!!</h1>

      </section>

    </main>
  );
}