"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRow = {
  id: number;
  fullname: string;
  email: string;
  role: string;
  token: string | null;
  createdAt: string;
};

function isUserRow(value: unknown): value is UserRow {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "number" &&
    typeof user.fullname === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string" &&
    (typeof user.token === "string" || user.token === null) &&
    typeof user.createdAt === "string"
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [hapusId, setHapusId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const router = useRouter();

  // Mengurutkan akun dan membuat nomor berdasarkan role
  const numberedUsers = [...users]
    .sort((a, b) => a.id - b.id)
    .map((user, index, array) => {
      const role = user.role.toLowerCase();

      const prefix =
        role === "admin"
          ? "ADM"
          : role === "staff"
            ? "STF"
            : role.toUpperCase().slice(0, 3);

      const sameRoleBefore = array
        .slice(0, index)
        .filter((item) => item.role.toLowerCase() === role).length;

      return {
        ...user,
        accountCode: `${prefix}${String(
          sameRoleBefore + 1
        ).padStart(7, "0")}`,
      };
    });

  // Ambil data saat halaman dimuat
  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    try {
      const res = await fetch("/api/accounts");
      const data: unknown = await res.json();

      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Gagal mengambil data user.";

        throw new Error(message);
      }

      if (!Array.isArray(data) || !data.every(isUserRow)) {
        throw new Error("Respons server bukan daftar user yang valid.");
      }

      setUsers(data);
      setLoadError("");
    } catch (error) {
      console.error("Gagal memuat data user:", error);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data user."
      );
    }
  }

  // Fungsi Hapus
  async function konfirmasiHapus() {
    if (hapusId === null) return;

    try {
      const res = await fetch(`/api/accounts/${hapusId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus akun.");
      }

      setHapusId(null);
      await ambilData();
    } catch (error) {
      console.error("Gagal menghapus akun:", error);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus akun."
      );
    }
  }

  // Fungsi Logout
  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout gagal");
      }

      router.push("/");
      router.refresh();
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
        </div>

        {/* Tombol Logout */}
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
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Akun
            </h1>

            {/* Tombol Tambah Akun */}
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
                  <th className="p-3">ID Akun</th>
                  <th className="p-3">Nama lengkap</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Token</th>
                  <th className="p-3">Dibuat</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loadError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-red-600"
                    >
                      {loadError}
                    </td>
                  </tr>
                ) : numberedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500"
                    >
                      Belum ada data.
                    </td>
                  </tr>
                ) : (
                  numberedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50"
                    >
                      {/* Nomor Admin / User Otomatis */}
                      <td className="p-3 font-mono font-semibold text-blue-600">
                        {user.accountCode}
                      </td>

                      <td className="p-3">
                        {user.fullname}
                      </td>

                      <td className="p-3">
                        {user.email}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user.role.toLowerCase() === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-3 max-w-[150px] truncate text-gray-500">
                        {user.token || "-"}
                      </td>

                      <td className="p-3">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString("id-ID")}
                      </td>

                      <td className="p-3 space-x-2">
                        {/* Tombol Edit */}
                        <Link
                          href={`/usermanagement/edit/${user.id}`}
                          className="bg-yellow-400 text-white px-3 py-1 rounded inline-block"
                        >
                          Edit
                        </Link>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setHapusId(user.id)}
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

      {/* Popup Hapus */}
      {hapusId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-72 text-center">
            <p className="mb-4">
              Yakin ingin menghapus akun ini?
            </p>

            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setHapusId(null)}
                className="border px-4 py-1 rounded"
              >
                Batal
              </button>

              <button
                onClick={konfirmasiHapus}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}