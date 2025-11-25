interface ErrorLog {
    id: number
    date: string
    origin: string
    description: string
    innerException?: string | null
    httpCode?: string | null
    browser?: string | null
    userIPAddress?: string | null
}

export default ErrorLog
