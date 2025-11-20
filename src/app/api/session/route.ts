import { cookies } from 'next/headers'

import Env from '@/utils/Env'
import Token from '@/entities/Token'

// Get current session
export async function GET() {
    const authToken = cookies().get('Authorization')
    if (!authToken?.value) {
        return new Response(
            JSON.stringify({ message: 'Not logged in', cookieExists: false }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    return new Response(
        JSON.stringify({ message: authToken.value, cookieExists: true }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}

// Handles a new session creation (login or register)
export async function POST(req: Request) {
    const response: Token = (await req.json()) as Token

    // Set the cookie using next/headers
    cookies().set({
        name: 'Authorization',
        value: response.accessToken,
        httpOnly: true,
        secure: Env.mode === 'prod',
        path: '/',
        maxAge: response.expirationInSeconds,
        sameSite: 'lax',
    })

    return new Response(JSON.stringify({ message: 'Logged in' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}

// Handles session finalization (logout)
export async function DELETE(req: Request) {
    cookies().delete('Authorization')

    return new Response(JSON.stringify({ message: 'Logged out' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
