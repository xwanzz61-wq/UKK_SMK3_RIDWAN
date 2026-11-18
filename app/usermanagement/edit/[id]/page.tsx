"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditAkunPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "user",
    jwt: "",
  });

  useEffect(() => {
    const accountId = params?.id;
    if (!accountId) return;

    async function ambilData() {
      try {
        const res = await fetch(`/api/accounts/${accountId}`);
        if (!res.ok) throw new Error("Gagal memuat data akun");

        const data = await res.json();
        setFormData({
          nama: data.nama || "",
          email: data.email || "",
          password: "",
          role: data.role || "user",
          jwt: data.jwt || "",
        });
      } catch (error) {
        console.error(error);
        alert("Data akun tidak ditemukan atau gagal dimuat.");
        router.push("/usermanagement");
      } finally {
        setFetching(false);
      }
    }

    ambilData();
  }, [params, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const accountId = params?.id;
      if (!accountId) throw new Error("ID akun tidak tersedia");

      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal memperbarui akun.");
      }

      router.push("/usermanagement");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Terjadi kesalahan saat update akun.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-600">
        Memuat data akun...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-white border-r p-5">
        <h1 className="text-xl font-bold mb-8">UKKSMT4</h1>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-3 rounded text-gray-600 hover:bg-gray-100">
            Dashboard Admin
          </Link>
          <Link href="/usermanagement" className="block p-3 rounded bg-blue-600 text-white">
            User Management
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b p-5">
          <h2 className="font-semibold">User Management</h2>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border max-w-3xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-800">Edit Akun</h1>
              <Link href="/usermanagement" className="text-sm text-blue-600 hover:underline">
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
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru (opsional)
                </label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
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
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
