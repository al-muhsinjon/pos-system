

import { connectToDatabase } from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Tokenni olish va mavjudligini tekshirish
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token mavjud emas" }, { status: 401 });
    }

    // Tokenni tasdiqlash
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);

    // Tasdiqlangan token ma'lumotlarini qaytarish
    return NextResponse.json({ success: true, data: decoded }, { status: 200 });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: "Tokenning amal qilish muddati tugagan" },
        { status: 401 }
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Noto‘g‘ri token" }, { status: 400 });
    } else {
      const result = error as Error;
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  }
}
