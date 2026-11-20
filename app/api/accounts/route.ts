import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "@/lib/password";

// Setup koneksi Prisma v7 pakai Adapter
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

// ==========================================
// 1. GET: Ambil Semua Data Akun
// ==========================================
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        token: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
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
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Data user tidak valid" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.fullname !== "string" ||
      !data.fullname.trim() ||
      typeof data.email !== "string" ||
      !data.email.trim() ||
      typeof data.password !== "string" ||
      !data.password
    ) {
      return NextResponse.json(
        { error: "Nama lengkap, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    const role = data.role === undefined ? "user" : data.role;
    if (role !== "user" && role !== "staff" && role !== "admin") {
      return NextResponse.json(
        { error: "Role user tidak valid" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        fullname: data.fullname.trim(),
        email: data.email.trim().toLowerCase(),
        password: await hashPassword(data.password),
        role,
        token:
          typeof data.token === "string" && data.token.trim()
            ? data.token.trim()
            : null,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        token: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error POST account:", error);
    return NextResponse.json(
      { error: "Gagal menambah data akun" },
      { status: 500 }
    );
  }
}