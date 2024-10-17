import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function GET(req: Request, route: { params: { userId: string } }) {
  await connectToDatabase();
  const { userId } = route.params;
  const user = await User.findOne({ roleId: userId });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: user }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  route: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = route.params;
    const user = await User.findOneAndDelete({ roleId: userId });

    if (!user) {
      return NextResponse.json(
        { message: "User not defined" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
        data: user,
      },
      { status: 203 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  route: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { username, role, password } = await req.json();
    const { userId } = route.params;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await hash(password, 10);
    }

    user.username = username || user.username;
    user.role = role || user.role;
    user.password = hashedPassword;

    await user.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
