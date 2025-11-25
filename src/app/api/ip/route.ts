import { NextRequest } from 'next/server'

// Get user's IP address
export async function GET(req: NextRequest) {
    const ip = req?.headers
        ? req.headers.get('x-forwarded-for') || req.ip || ''
        : ''

    if (!ip) {
        return new Response(JSON.stringify({ message: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify({ message: ip }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
