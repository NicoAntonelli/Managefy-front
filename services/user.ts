import axios from 'axios'
import Env from '@/utils/Env'
import Helper from './helper'

import Registration from '@/entities/Registration'
import Token from '@/entities/Token'

const prefix = `${Env.backendAPI}/users`

const register = async (register: Registration): Promise<Token> => {
    const endpoint = `${prefix}/register`
    try {
        const response = await axios.post<Token>(endpoint, register)
        Helper.validateResponse(response)

        return response.data
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const User = { register }
export default User
