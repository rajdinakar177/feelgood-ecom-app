import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// We use `jose` here (not `jsonwebtoken`) because this file runs on the
// Edge runtime, which doesn't support Node's crypto module that
// `jsonwebtoken` depends on internally. `jose` works on both Edge and Node.

export async function proxy(request: NextRequest) {

    const path = request.nextUrl.pathname;

    const isPublicPath = ['/login', '/signup'].includes(path);
    const isAdminPath = path.startsWith('/admin');

    const token = request.cookies.get('token')?.value || '';

    // ── Admin section: requires a valid token AND role === "admin" ──────────
    if (isAdminPath) {

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', path);
            return NextResponse.redirect(loginUrl);
        }

        try {

            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== 'admin') {
                // Logged in, but not an admin — send home rather than to
                // login, since logging in again won't fix a non-admin account
                return NextResponse.redirect(new URL('/', request.url));
            }

            return NextResponse.next();

        } catch (error) {

            // Token invalid or expired
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', path);
            return NextResponse.redirect(loginUrl);

        }

    }

    // ── Existing logic, unchanged ────────────────────────────────────────────
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/profile',
        '/login',
        '/signup',
        '/admin/:path*',
    ]
}