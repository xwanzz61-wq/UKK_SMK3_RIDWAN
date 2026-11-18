import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Cari user berdasarkan email
    const user = await prisma.account.findUnique({
      where: { email: email },
    });

    // Jika user tidak ditemukan atau password salah
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Login berhasil (Di aplikasi nyata, di sini kamu harus membuat JWT/Session)
    return NextResponse.json({
      message: "Login berhasil",
      user: { id: user.id, nama: user.nama, role: user.role },
    });
  } catch (error) {
    console.error("Error Login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}