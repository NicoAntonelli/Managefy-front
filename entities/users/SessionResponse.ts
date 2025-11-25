interface SessionResponse {
    message: string // Could be the session token or an error message
    cookieExists: boolean
}

export default SessionResponse
