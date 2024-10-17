import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { roleId, password } = await req.json();

    const user = await User.findOne({ roleId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Password or ID incorrect!" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        roleId: user.roleId,
      },
      process.env.NEXT_PUBLIC_JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    console.log(process.env.NEXT_PUBLIC_JWT_SECRET!);

    return NextResponse.json(
      { success: true, message: "Login successful!", token },
      { status: 200 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
