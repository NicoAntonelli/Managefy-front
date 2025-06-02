import { cookies } from 'next/headers'

import Env from '@/utils/Env'
import Token from '@/entities/Token'

// Handles a new session creation (login or register)
export async function POST(req: Request) {
    const response: Token = (await req.json()) as Token

    // To-do: validate token

    // Set the cookie using next/headers
    cookies().set({
        name: 'Authorization',
        value: response.accessToken,
        httpOnly: true,
        secure: Env.mode === 'production',
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
