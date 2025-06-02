import axios from 'axios'
import Env from '@/utils/Env'
import Helper from './helper'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'
import Token from '@/entities/Token'
import User from '@/entities/User'

const prefix = `${Env.backendAPI}/users`

const login = async (login: Login): Promise<User> => {
    const endpoint = `${prefix}/login`
    try {
        const response = await axios.post<Token>(endpoint, login)
        Helper.validateResponse(response)

        const user = sessionCreate(response.data)

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const register = async (register: Registration): Promise<User> => {
    const endpoint = `${prefix}/register`
    try {
        const response = await axios.post<Token>(endpoint, register)
        Helper.validateResponse(response)

        const user = sessionCreate(response.data)

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const sessionCreate = async (token: Token): Promise<User> => {
    const endpoint = `${Env.baseURL}/api/login`
    try {
        if (!token.accessToken) {
            throw new Error('Access token is missing in the response')
        }

        const response = await axios.post<string>(endpoint, token)
        Helper.validateResponse(response)

        //const user:User = deserializeCookie(token.accessToken)

        // Dummy user
        const user: User = {
            id: 1,
            email: 'jdoe@example.com',
            name: 'John Doe',
            validated: true,
            emailNotifications: true,
        }

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const Users = { login, register }
export default Users
