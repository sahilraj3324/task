import { NextResponse } from 'next/server';

export const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/** Call this at the top of every route file to handle OPTIONS preflight */
export function handleOptions() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Wrap any NextResponse with CORS headers */
export function withCors(response: NextResponse): NextResponse {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/** Shorthand helpers for consistent response envelope + CORS */
export function ok(data: unknown, message: string, status = 200) {
    return withCors(
        NextResponse.json({ success: true, data, message }, { status })
    );
}

export function err(message: string, status = 400) {
    return withCors(
        NextResponse.json({ success: false, data: null, message }, { status })
    );
}
