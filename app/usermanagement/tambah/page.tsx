"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TambahAkunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Tambahkan password di state formData
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "", // <--- TAMBAHAN
    role: "user",
    jwt: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/usermanagement");
        router.refresh();
      } else {
        alert("Gagal menambah akun.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-white border-r p-5">
        <h1 className="text-xl font-bold mb-8">UKKSMT4</h1>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block p-3 rounded text-gray-600 hover:bg-gray-100"
          >
            Dashboard Admin
          </Link>
          <Link
            href="/usermanagement"
            className="block p-3 rounded bg-blue-600 text-white"
          >
            User Management
          </Link>
        </nav>
      </aside>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-1 flex flex-col">
        
        {/* HEADER / NAVBAR ATAS */}
        <header className="bg-white border-b p-5">
          <h2 className="font-semibold">User Management</h2>
        </header>

        {/* AREA FORM (FULLSCREEN) */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border max-w-3xl">
            
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-800">Tambah Akun Baru</h1>
              <Link
                href="/usermanagement"
                className="text-sm text-blue-600 hover:underline"
              >
                &larr; Kembali
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Masukkan email"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* 2. TAMBAHKAN INPUT PASSWORD DI SINI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  JWT (Opsional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Masukkan token JWT jika ada"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.jwt}
                  onChange={(e) => setFormData({ ...formData, jwt: e.target.value })}
                />
              </div>

              <div className="pt-4 flex space-x-3 border-t mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium"
                >
                  {loading ? "Menyimpan..." : "Simpan Akun"}
                </button>
                <Link
                  href="/usermanagement"
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded hover:bg-gray-300 font-medium text-center"
                >
                  Batal
                </Link>
              </div>
            </form>

          </div>
        </div>
      </main>
      
    </div>
  );
}