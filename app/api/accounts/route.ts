import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Setup koneksi Prisma v7 pakai Adapter
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

// ==========================================
// 1. GET: Ambil Semua Data Akun
// ==========================================
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error GET accounts:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data akun" },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: Tambah Akun Baru
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.nama || !body?.email || !body?.password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    const newAccount = await prisma.account.create({
      data: {
        nama: body.nama,
        email: body.email,
        password: body.password,
        role: body.role || "user",
        jwt: body.jwt || null,
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error("Error POST account:", error);
    return NextResponse.json(
      { error: "Gagal menambah data akun" },
      { status: 500 }
    );
  }
}