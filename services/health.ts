import axios from 'axios'
import Env from '@/utils/Env'
import Helper from './helper'

const prefix = Env.backendAPI

const testAPI = async (): Promise<string> => {
    try {
        const response = await axios.get<string>(prefix)
        if (!response) {
            throw new Error('No response from API')
        } else if (response.status !== 200) {
            throw new Error(
                `API responded with an invalid status: ${response.status} '${response.statusText}'`
            )
        } else if (!response.data) {
            throw new Error('API responded with 200 but with an empty body')
        }

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, '/'))
    }
}

const Health = { testAPI }
export default Health
