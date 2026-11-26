import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { evaluateRouteAccess } from "@/lib/role.helper";

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;
  const userRole = req.auth?.user?.role;

  const decision = evaluateRouteAccess(userRole, pathname);

  if (!decision.allowed && decision.redirectPath) {
    const redirectUrl = new URL(decision.redirectPath, req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
