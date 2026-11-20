"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type AccountSummary = {
  id: number;
  role: string;
};

function generateAccountCode(
  id: number,
  role: string,
  accounts: AccountSummary[]
) {
  const normalizedRole = role.toLowerCase();

  const prefix =
    normalizedRole === "admin"
      ? "ADM"
      : normalizedRole === "staff"
        ? "STF"
        : normalizedRole.toUpperCase().slice(0, 3);

  const sameRoleBefore = accounts.filter(
    (account) =>
      account.id !== id &&
      account.id < id &&
      account.role.toLowerCase() === normalizedRole
  ).length;

  return `${prefix}${String(sameRoleBefore + 1).padStart(7, "0")}`;
}

export default function EditAkunPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const accountId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [accountCode, setAccountCode] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
    token: "",
  });

  // Ambil data akun
  useEffect(() => {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      router.push("/usermanagement");
      return;
    }

    async function ambilData() {
      try {
        const [res, accountsRes] = await Promise.all([
          fetch(`/api/accounts/${accountId}`),
          fetch("/api/accounts"),
        ]);

        if (!res.ok) {
          throw new Error("Gagal memuat data akun.");
        }

        if (!accountsRes.ok) {
          throw new Error("Gagal mengambil daftar akun.");
        }

        const data = await res.json();
        const accountsData = await accountsRes.json();

        if (!Array.isArray(accountsData)) {
          throw new Error("Daftar akun tidak valid.");
        }

        const accountList: AccountSummary[] = accountsData
          .filter(
            (item: unknown) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              "role" in item &&
              typeof item.id === "number" &&
              typeof item.role === "string"
          )
          .map((item: AccountSummary) => ({
            id: item.id,
            role: item.role,
          }));

        setAccounts(accountList);

        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          password: "",
          role: data.role || "user",
          token: data.token || "",
        });

        setAccountCode(
          generateAccountCode(accountId, data.role || "user", accountList)
        );
      } catch (error) {
        console.error(error);
        alert("Data akun tidak ditemukan atau gagal dimuat.");
        router.push("/usermanagement");
      } finally {
        setFetching(false);
      }
    }

    ambilData();
  }, [accountId, router]);

  // Perbarui nomor ketika role berubah
  useEffect(() => {
    if (accounts.length > 0 && accountId > 0) {
      setAccountCode(
        generateAccountCode(accountId, formData.role, accounts)
      );
    }
  }, [formData.role, accounts, accountId]);

  // Simpan perubahan
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!accountId) {
        throw new Error("ID akun tidak tersedia.");
      }

      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        throw new Error(
          errorData.error || "Gagal memperbarui akun."
        );
      }

      alert("Akun berhasil diperbarui!");

      router.push("/usermanagement");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat update akun."
      );
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

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-5">
        <h1 className="text-xl font-bold mb-8">
          UKKSMT4
        </h1>

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">

        <header className="bg-white border-b p-5">
          <h2 className="font-semibold">
            User Management
          </h2>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border max-w-3xl">

            {/* Header Form */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Edit Akun
              </h1>

              <Link
                href="/usermanagement"
                className="text-sm text-blue-600 hover:underline"
              >
                &larr; Kembali
              </Link>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ID Akun */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Akun
                </label>

                <input
                  type="text"
                  readOnly
                  value={accountCode}
                  className="w-full border border-gray-300 p-2.5 rounded bg-gray-100 text-blue-600 font-mono font-semibold cursor-not-allowed"
                />

                <p className="text-xs text-gray-500 mt-1">
                  ID akun dibuat otomatis berdasarkan role.
                </p>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullname: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru (Opsional)
                </label>

                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>

                <select
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <p className="text-xs text-gray-500 mt-1">
                  Mengubah role akan mengubah awalan ID akun.
                </p>
              </div>

              {/* Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token (Opsional)
                </label>

                <textarea
                  rows={4}
                  placeholder="Masukkan token jika ada"
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.token}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      token: e.target.value,
                    })
                  }
                />
              </div>

              {/* Tombol */}
              <div className="pt-4 flex space-x-3 border-t mt-6">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium"
                >
                  {loading
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
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