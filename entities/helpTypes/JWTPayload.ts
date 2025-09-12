interface JWTPayload {
    exp: number
    iat: number
    sub: string // The real payload is in 'sub' as a string
}

export default JWTPayload
