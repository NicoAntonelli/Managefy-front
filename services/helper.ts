import axios, { AxiosResponse } from 'axios'
import ErrorResponse from '@/entities/helpTypes/ErrorResponse'

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

// Parse as error message from any type of error
const parseError = (error: any): string => {
    let message = 'An error occurred while processing your request'

    if (error instanceof Error) {
        message = error.message
    } else if (typeof error === 'string') {
        message = error
    }

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

    console.error(`Error fetching ${endpoint}: '${message}'`) // To-Do: Save to logging service...
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
    isErrorResponse,
    parseError,
    parseLogErrorAPI,
    validateResponseAPI,
}

export default Helper
