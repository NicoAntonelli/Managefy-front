import { AxiosResponse } from 'axios'
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

// Validate standard API response
const validateResponse = (response: AxiosResponse<any, any>) => {
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

const Helper = { isErrorResponse, validateResponse }

export default Helper
