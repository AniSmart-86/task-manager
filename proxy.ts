import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("taskManagerToken")?.value;
  const role = request.cookies.get("taskManagerRole")?.value;

  // Protect /superadmin routes — only superadmin can access
  if (pathname.startsWith("/superadmin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "superadmin") {
      // Admin goes to admin dashboard, members to user dashboard
      const dest = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Protect /admin routes — admin and superadmin can access
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"],
};
