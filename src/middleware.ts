import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/shared/constants/AppRoutes";

type Role = "user" | "company" | "admin" | null;

const DASHBOARD_BY_ROLE: Record<Exclude<Role, null>, string> = {
  user: ROUTES.USER.HOME_PAGE,
  company: ROUTES.COMPANY.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
};

function getRoleFromCookies(req: NextRequest): Role {
  const hasFrontendSession = req.cookies.has("frontend_session");

  if (!hasFrontendSession) {
    return null;
  }

  const hasAdmin =
    req.cookies.has("adminAccessToken") ||
    req.cookies.has("adminRefreshToken");

  if (hasAdmin) return "admin";

  const hasCompany =
    req.cookies.has("companyAccessToken") ||
    req.cookies.has("companyRefreshToken");

  if (hasCompany) return "company";

  const hasUser =
    req.cookies.has("userAccessToken") ||
    req.cookies.has("userRefreshToken");

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
    pathname === ROUTES.SIGNUP ||
    pathname.startsWith(ROUTES.SIGNUP) ||
    pathname === ROUTES.LOGIN ||
    pathname.startsWith(ROUTES.LOGIN) ||
    pathname === ROUTES.OTP ||
    pathname.startsWith(ROUTES.OTP) ||
    pathname === ROUTES.FORGOT_PASSWORD ||
    pathname.startsWith(ROUTES.FORGOT_PASSWORD) ||
    pathname === ROUTES.RESET_PASSWORD ||
    pathname.startsWith(ROUTES.RESET_PASSWORD)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const role = getRoleFromCookies(req);
  const isAuthed = role !== null;

  console.log("---- MIDDLEWARE ----");
  console.log("PATH:", pathname);
  console.log("ROLE:", role);

  // -------------------------------
  // 1️⃣ Block unauthenticated access
  // -------------------------------
  if (!isAuthed && isProtectedPath(pathname)) {
    const url = req.nextUrl.clone();

    if (pathname.startsWith("/Admin")) {
      url.pathname = ROUTES.LOGIN;
    } else {
      url.pathname = ROUTES.SIGNUP;
      url.searchParams.set("show", "login");
    }

    url.searchParams.set("next", pathname + req.nextUrl.search);

    console.log("➡️ Redirect: Unauth user →", url.pathname);

    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------
  // 2️⃣ Redirect authenticated users away from auth/root
  // ---------------------------------------------------
  if (isAuthed && (pathname === "/" || isAuthPage(pathname))) {
    const redirectPath = DASHBOARD_BY_ROLE[role];

    if (pathname !== redirectPath) {
      const url = req.nextUrl.clone();

      url.pathname = redirectPath;
      url.search = "";

      console.log("➡️ Redirect: Auth user →", redirectPath);

      return NextResponse.redirect(url);
    }
  }

  // -------------------------------
  // 3️⃣ Default: allow request
  // -------------------------------
  console.log("✅ Allow: No redirect");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets).*)",
  ],
};