import decodeToken from './decodeToken'
import Env from '@/utils/Env'

import User from '@/entities/User'

// Auth middleware
const auth = async (context: any) => {
    // Redirection if the validation fails
    const redirect = {
        permanent: false,
        destination: Env.baseURL,
    }

    try {
        // Get requested URL
        const url: string = context.req.url ?? ''

        // Get JWT
        const authToken: string = context?.req?.cookies['Authorization'] ?? null
        if (!authToken) return { redirect }

        // Validate payload content
        const payloadUser: User | null = decodeToken(authToken) as User | null
        if (!payloadUser) return { redirect }

        return { props: {} }
    } catch (error) {
        console.error('Error while verifying user:', error)
        return { redirect }
    }
}

export default auth
