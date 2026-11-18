import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("isLoggedIn");
  
  return NextResponse.json({ message: "Logout berhasil" });
}