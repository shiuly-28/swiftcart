import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    const publicRoutes = ["/login", "/register", "/api/auth", "/select-role"]
    if (publicRoutes.some((path) => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    const session = await auth()
    if (!session) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.url)
        return NextResponse.redirect(loginUrl)
    }

    const role = session.user?.role

    // role নেই → select-role এ পাঠাও
    if (!role && pathname !== "/select-role") {
        return NextResponse.redirect(new URL("/select-role", req.url))
    }

    // role আছে কিন্তু select-role এ আছে → dashboard এ পাঠাও
    if (role && pathname === "/select-role") {
        if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url))
        if (role === "deliveryBoy") return NextResponse.redirect(new URL("/delivery", req.url))
        return NextResponse.redirect(new URL("/user/cart", req.url))
    }

    if (pathname.startsWith("/user") && role !== "user") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}