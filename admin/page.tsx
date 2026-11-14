
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-6 text-white">
        <h1 className="mb-10 text-2xl font-bold">
          UKKSMT4
        </h1>

        <p className="mb-3 text-xs uppercase text-gray-400">
          Menu Utama
        </p>

        <nav className="space-y-2">
          <a href="/admin" className="block rounded-lg bg-blue-600 p-3">
            Dashboard
          </a>

          <a href="#" className="block rounded-lg p-3 hover:bg-slate-700">
            Users
          </a>

          <a href="#" className="block rounded-lg p-3 hover:bg-slate-700">
            Categories
          </a>

          <a href="#" className="block rounded-lg p-3 hover:bg-slate-700">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">

        <header className="mb-8 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Admin
          </h2>

          <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            Administrator
          </span>
        </header>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Selamat Datang!
          </h2>

          <p className="mt-1 text-gray-500">
            Ini adalah halaman dashboard administrator UKKSMT4.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="mt-3 text-3xl font-bold text-gray-800">0</h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Categories</p>
            <h3 className="mt-3 text-3xl font-bold text-gray-800">0</h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Admin</p>
            <h3 className="mt-3 text-3xl font-bold text-gray-800">1</h3>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Informasi Dashboard
          </h3>

          <p className="mt-3 text-gray-500">
            Belum ada aktivitas yang ditampilkan.
          </p>
        </div>

      </main>
    </div>
  );
}
