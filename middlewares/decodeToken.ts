import jwt from 'jsonwebtoken'
import JWTPayload from '@/entities/helpTypes/JWTPayload'
import User from '@/entities/users/User'

// Decode token without signature (validation) and return decoded values
const decodeToken = (token: string): User | null => {
    if (!token) return null

    try {
        // Decode JWT
        const user: JWTPayload | null = jwt.decode(token) as JWTPayload | null
        if (!user) throw new Error('Error decoding JWT')

        // Extract key-value pairs from 'sub' string
        const content = user.sub.replace(/^User{|}$/g, '').split(', ')

        // Create dynamic user object
        const userObject: any = {}
        content.forEach((pair: string) => {
            const [key, rawValue] = pair.split('=')
            let value: any = rawValue

            // Type casting for non-string values
            if (value === 'true' || value === 'false') {
                value = value === 'true'
            } else if (!isNaN(Number(value))) {
                value = Number(value)
            }

            userObject[key] = value
        })

        return userObject as User
    } catch (error) {
        console.log('Error while decoding token:', error)
        return null
    }
}

export default decodeToken
