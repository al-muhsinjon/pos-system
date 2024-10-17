import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, role, password } = await req.json();
    const userExists = await User.findOne({ username });

    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await User.create({ username, role, password: hashedPassword });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
