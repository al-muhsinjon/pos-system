import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyToken } from "./utils/api";

interface DecodeForProps {
  id: string;
  username: string;
  role: "Cashier" | "SuperAdmin";
  roleId: string;
}

export async function middleware(req: NextRequest) {
  const publicPaths = ["/auth/login"];
  const { pathname } = req.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const decoded = jwt.decode(token);
  const user = decoded as DecodeForProps;

  console.log(user);

  const isValid = await verifyToken(token);

  if (!isValid.success) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  //   const user = decoded as {
  //     role: string;
  //   };

  //   if (user.role === "SuperAdmin") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   } else if (user.role === "Cashier") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }

  //   // Default case if role is not handled
  //   return NextResponse.redirect(new URL("/auth/login", req.url));
  // } catch (error) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url));
  // }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ], // Specify the paths that require authentication
};
