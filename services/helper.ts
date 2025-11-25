import axios, { AxiosResponse } from 'axios'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import ErrorLogs from './errorLog'
import Users from './users'

import ErrorResponse from '@/entities/helpTypes/ErrorResponse'
import User from '@/entities/users/User'
import ErrorLogC from '@/entities/errorLogs/ErrorLogC'

// Get current user, optionally redirect to login/register
const getUserOrAuthenticate = async (
    router: AppRouterInstance,
    redirect: boolean
) => {
    try {
        const user: User | null = await Users.sessionGet()
        if (!user) {
            if (redirect) router.push('/users/loginRegister')
            return null
        }

        return user
    } catch (error) {
        console.error(error)
        parseLogError(error)

        if (redirect) router.push('/users/loginRegister')

        return null
    }
}

// Type guard to check if data is an ErrorResponse
const isErrorResponse = (data: any): data is ErrorResponse => {
    return (
        data &&
        typeof data === 'object' &&
        typeof data.message === 'string' &&
        typeof data.status === 'number' &&
        typeof data.error === 'string'
    )
}

// Log an error message to the error logging service
const logError = async (message: string): Promise<void> => {
    try {
        const ipAddress = await Users.getUserIPAddress()

        const errorLog: ErrorLogC = {
            description: message,
            browser: navigator.userAgent,
            userIPAddress: ipAddress ?? '',
        }

        const response = await ErrorLogs.createLogError(errorLog)

        if (!response) {
            throw new Error('Failed to log the error to the logging service')
        }

        console.log('Previous error logged to the logging service')
    } catch (error: any) {
        // Don't throw error further to avoid infinite loops in case of logging service failure
        console.error('Failed to log the previous error to the logging service')
    }
}

// Parse as error message from any type of frontend error
const parseError = (error: any): string => {
    let message = 'An error occurred while processing your request'

    if (error instanceof Error) {
        message = error.message
    } else if (typeof error === 'string') {
        message = error
    }

    return message
}

// Parse as error message from any type of frontend error then log it
const parseLogError = (error: any): string => {
    let message = parseError(error)

    console.log(message)
    logError(message)

    return message
}

// Parse as error message from errors returned by API then log it
const parseLogErrorAPI = (error: any, endpoint: string): string => {
    let message = 'API responded with an error'

    if (axios.isAxiosError(error)) {
        if (error.response && isErrorResponse(error.response.data)) {
            message = error.response.data.message
        } else if (error.message) {
            message = error.message
        }
    } else {
        message = parseError(error)
    }

    message = `Error fetching ${endpoint}: '${message}'`

    console.error(message)
    logError(message)

    return message
}

// Validate standard API response
const validateResponseAPI = (response: AxiosResponse<any, any>) => {
    if (!response) {
        throw new Error('No response from API')
    }

    if (response.status !== 200) {
        throw new Error(
            `API responded with an invalid status: ${response.status} '${response.statusText}'`
        )
    }

    if (!response.data) {
        throw new Error('API responded with 200 but with an empty body')
    }
}

const Helper = {
    getUserOrAuthenticate,
    isErrorResponse,
    logError,
    parseError,
    parseLogError,
    parseLogErrorAPI,
    validateResponseAPI,
}

export default Helper
