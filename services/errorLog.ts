import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import ErrorLog from '@/entities/errorLogs/ErrorLog'
import ErrorLogC from '@/entities/errorLogs/ErrorLogC'

const prefix = `${Env.backendAPI}/errorLogs`

// List frontend error logs within a date range - Date parameters must be in ISO format (YYYY-MM-DD)
const listFrontendErrors = async (
    fromDate: string,
    toDate: string
): Promise<ErrorLog[]> => {
    const endpoint = `${prefix}/front?from=${fromDate}&to=${toDate}`
    try {
        const response = await api.get<ErrorLog[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

// Create a new error log entry
const createLogError = async (errorLog: ErrorLogC): Promise<boolean | null> => {
    const endpoint = prefix
    try {
        const response = await api.post<boolean>(endpoint, errorLog)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        // Don't throw error further to avoid infinite loops in case of logging service failure
        console.log(error)
        return null
    }
}

const ErrorLogs = { listFrontendErrors, createLogError }
export default ErrorLogs
