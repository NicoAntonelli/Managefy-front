import axios from 'axios'
import Env from '@/utils/Env'

const prefix = Env.backendAPI

const testAPI = async (): Promise<string> => {
    try {
        const response = await axios.get<string>(prefix)
        if (!response || response.status !== 200 || !response.data) {
            throw new Error('Invalid response from API')
        }
        return response.data
    } catch (error) {
        console.error('Error fetching health status:', error)
        throw error
    }
}

const Health = { testAPI }
export default Health
