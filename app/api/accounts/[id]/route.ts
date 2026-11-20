import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "@/lib/password";

// Setup koneksi Prisma v7 pakai Adapter
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "ID user tidak valid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
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
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "ID user tidak valid" }, { status: 400 });
    }

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
      !data.email.trim()
    ) {
      return NextResponse.json(
        { error: "Nama lengkap dan email wajib diisi" },
        { status: 400 }
      );
    }

    if (data.role !== "user" && data.role !== "staff" && data.role !== "admin") {
      return NextResponse.json(
        { error: "Role user tidak valid" },
        { status: 400 }
      );
    }

    const updateData: {
      fullname: string;
      email: string;
      password?: string;
      role: string;
      token: string | null;
    } = {
      fullname: data.fullname.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      token:
        typeof data.token === "string" && data.token.trim()
          ? data.token.trim()
          : null,
    };

    if (typeof data.password === "string" && data.password.trim() !== "") {
      updateData.password = await hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return NextResponse.json(updatedUser);
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
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: "ID user tidak valid" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Error DELETE account:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data akun" },
      { status: 500 }
    );
  }
}