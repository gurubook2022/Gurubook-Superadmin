import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET!;

// Real URL paths behind the (admin) and (superadmin) route groups.
const ADMIN_ONLY_PATHS = ["/overview", "/users", "/settings", "/billing-invoices"];
const SUPERADMIN_ONLY_PATHS = [
    "/dashboard",
    "/admins",
    "/analytics",
    "/media-management",
    "/notifications",
    "/pricing",
    "/questions",
    "/sepa-mandate",
    "/testing",
];

const matchesPath = (pathname: string, paths: string[]) =>
    paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = await getToken({
        req,
        secret,
    });

    if (!token) {
        if (path !== "/sign-in") {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        return NextResponse.next();
    }

    const role = token.role;

    // Only ADMIN and SUPERADMIN are valid roles for this admin panel.
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (matchesPath(path, ADMIN_ONLY_PATHS) && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (matchesPath(path, SUPERADMIN_ONLY_PATHS) && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/overview", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
