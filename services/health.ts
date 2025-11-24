import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

const prefix = Env.backendAPI

const testAPI = async (): Promise<string> => {
    const endpoint = prefix
    try {
        const response = await api.get<string>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Health = { testAPI }
export default Health
