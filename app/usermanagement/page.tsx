// app/usermanagement/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [accounts, setAccounts] = useState([]);
  const [hapusId, setHapusId] = useState(null);
  const router = useRouter();

  // Ambil data saat halaman dimuat
  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(data);
  }

  // Fungsi Hapus
  async function konfirmasiHapus() {
    await fetch(`/api/accounts/${hapusId}`, { method: "DELETE" });
    setHapusId(null);
    ambilData(); // Refresh tabel
  }

  // Fungsi Logout
  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout gagal");
      }
      router.push("/");
      router.refresh(); // Memastikan state ter-reset
    } catch (error) {
      console.error("Gagal logout", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">UKKSMT4</h1>
          <nav className="space-y-2">
            <Link href="/admin" className="block p-3 rounded text-gray-600 hover:bg-gray-100">
              Dashboard Admin
            </Link>
            <Link href="/usermanagement" className="block p-3 rounded bg-blue-600 text-white">
              User Management
            </Link>
          </nav>
        </div>

        {/* TOMBOL LOGOUT DI BAGIAN BAWAH SIDEBAR */}
        <button
          onClick={handleLogout}
          className="w-full mt-auto bg-red-100 text-red-600 p-3 rounded font-semibold hover:bg-red-200 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white border-b p-5">
          <h2 className="font-semibold">User Management</h2>
        </header>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Akun</h1>
            
            {/* TOMBOL INI MENGARAH KE HALAMAN TAMBAH */}
            <Link
              href="/usermanagement/tambah"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Tambah Akun
            </Link>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">No.</th>
                  <th className="p-3">Nama lengkap</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">JWT</th>
                  <th className="p-3">Dibuat</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Belum ada data.
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc: any, index: number) => (
                    <tr key={acc.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{acc.nama}</td>
                      <td className="p-3">{acc.email}</td>
                      <td className="p-3">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {acc.role}
                        </span>
                      </td>
                      <td className="p-3 max-w-[150px] truncate text-gray-500">
                        {acc.jwt || "-"}
                      </td>
                      <td className="p-3">
                        {new Date(acc.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-3 space-x-2">
                        {/* TOMBOL EDIT (Sudah saya perbaiki, sebelumnya malah ke halaman tambah) */}
                        <Link
                          href={`/usermanagement/edit/${acc.id}`}
                          className="bg-yellow-400 text-white px-3 py-1 rounded inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setHapusId(acc.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POPUP HAPUS */}
      {hapusId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-72 text-center">
            <p className="mb-4">Yakin ingin menghapus akun ini?</p>
            <div className="flex justify-center space-x-2">
              <button onClick={() => setHapusId(null)} className="border px-4 py-1 rounded">
                Batal
              </button>
              <button onClick={konfirmasiHapus} className="bg-red-500 text-white px-4 py-1 rounded">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}