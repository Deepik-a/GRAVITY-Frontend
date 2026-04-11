import { NextRequest, NextResponse } from "next/server";

type Role = "user" | "company" | "admin" | null;

const DASHBOARD_BY_ROLE: Record<Exclude<Role, null>, string> = {
  user: "/User/HomePage",
  company: "/Company/CompanyDashBoard",
  admin: "/Admin/AdminDashBoard",
};

function getRoleFromCookies(req: NextRequest): Role {
  const hasAdmin =
    req.cookies.has("adminAccessToken") || req.cookies.has("adminRefreshToken");
  if (hasAdmin) return "admin";

  const hasCompany =
    req.cookies.has("companyAccessToken") || req.cookies.has("companyRefreshToken");
  if (hasCompany) return "company";

  const hasUser =
    req.cookies.has("userAccessToken") || req.cookies.has("userRefreshToken");
  if (hasUser) return "user";

  return null;
}

function isProtectedPath(pathname: string) {
  return (
    pathname === "/User" ||
    pathname.startsWith("/User/") ||
    pathname === "/Company" ||
    pathname.startsWith("/Company/") ||
    pathname === "/Admin" ||
    pathname.startsWith("/Admin/")
  );
}

function isAuthPage(pathname: string) {
  return (
    pathname === "/signup" ||
    pathname.startsWith("/signup") ||
    pathname === "/Login" ||
    pathname.startsWith("/Login") ||
    pathname === "/otp" ||
    pathname.startsWith("/otp") ||
    pathname === "/ForgotPassword" ||
    pathname.startsWith("/ForgotPassword") ||
    pathname === "/ResetPassword" ||
    pathname.startsWith("/ResetPassword")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRoleFromCookies(req);
  const isAuthed = role !== null;
  const docStatus = req.cookies.get("documentStatus")?.value;

  // Block unauthenticated access to protected route segments
  if (!isAuthed && isProtectedPath(pathname)) {
    const url = req.nextUrl.clone();
    if (pathname.startsWith("/Admin")) {
      url.pathname = "/Login";
    } else {
      url.pathname = "/signup";
      url.searchParams.set("show", "login");
    }
    url.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 🔥 RESTRICTION: Redirect companies away from Dashboard if they are not verified
  if (isAuthed && role === "company" && pathname.startsWith("/Company/CompanyDashBoard")) {
     if (docStatus === "pending" || docStatus === "rejected" || !docStatus) {
        const url = req.nextUrl.clone();
        url.pathname = "/signup";
        url.searchParams.set("show", "login");
        return NextResponse.redirect(url);
     }
  }

  // Redirect authenticated users away from landing/auth pages
  if (isAuthed && (pathname === "/" || isAuthPage(pathname))) {
    // 🔥 EXCEPTION: If company is pending or rejected, STAY on the auth/landing page (don't redirect to dashboard)
    if (role === "company" && (docStatus === "pending" || docStatus === "rejected" || !docStatus)) {
       return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = DASHBOARD_BY_ROLE[role];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on all routes except:
     * - Next.js internals
     * - static assets
     * - API routes (backend calls)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets).*)",
  ],
};

