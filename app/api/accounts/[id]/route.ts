import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Setup koneksi Prisma v7 pakai Adapter
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = await prisma.account.findUnique({
      where: { id: Number(id) },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Akun tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error GET account by id:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data akun" },
      { status: 500 }
    );
  }
}

// ==========================================
// 3. PUT: Edit Akun Berdasarkan ID
// ==========================================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body?.nama || !body?.email) {
      return NextResponse.json(
        { error: "Nama dan email wajib diisi" },
        { status: 400 }
      );
    }

    const updateData: {
      nama: string;
      email: string;
      password?: string;
      role: string;
      jwt: string | null;
    } = {
      nama: body.nama,
      email: body.email,
      role: body.role || "user",
      jwt: body.jwt?.trim() ? body.jwt : null,
    };

    if (typeof body.password === "string" && body.password.trim() !== "") {
      updateData.password = body.password;
    }

    const updatedAccount = await prisma.account.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error PUT account:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data akun" },
      { status: 500 }
    );
  }
}

// ==========================================
// 4. DELETE: Hapus Akun Berdasarkan ID
// ==========================================
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.account.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Error DELETE account:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data akun" },
      { status: 500 }
    );
  }
}