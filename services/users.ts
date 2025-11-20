import axios from 'axios'
import decodeToken from '@/middlewares/decodeToken'
import Env from '@/utils/Env'
import Helper from './helper'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'
import SessionResponse from '@/entities/helpTypes/SessionResponse'
import Token from '@/entities/Token'
import User from '@/entities/User'

const prefix = `${Env.backendAPI}/users`

const getOneUser = async (id: number): Promise<User> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await axios.get<User>(endpoint)
        Helper.validateResponse(response)

        return response.data
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const login = async (loginData: Login): Promise<User> => {
    const endpoint = `${prefix}/login`
    try {
        const response = await axios.post<Token>(endpoint, loginData)
        Helper.validateResponse(response)

        const user = sessionCreate(response.data)

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const logout = async (): Promise<void> => {
    const endpoint = `${Env.baseURL}/api/session`
    try {
        const response = await axios.delete<string>(endpoint)
        Helper.validateResponse(response)
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const register = async (registration: Registration): Promise<User> => {
    const endpoint = `${prefix}/register`
    try {
        const response = await axios.post<Token>(endpoint, registration)
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
    const endpoint = `${Env.baseURL}/api/session`
    try {
        if (!token.accessToken) {
            throw new Error('Access token is missing in the response')
        }

        const response = await axios.post<string>(endpoint, token)
        Helper.validateResponse(response)

        const user: User | null = decodeToken(token.accessToken) as User | null
        if (!user) throw new Error('Error decoding token')

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

// No API call, just reads the session cookie
const sessionGet = async (): Promise<User | null> => {
    const endpoint = `${Env.baseURL}/api/session`
    try {
        const response = await axios.get<SessionResponse>(endpoint)
        if (!response?.data) return null

        const { message, cookieExists } = response.data
        if (!cookieExists) return null

        const user: User | null = decodeToken(message) as User | null
        if (!user) throw new Error('Error decoding token')

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const validationStart = async (): Promise<boolean> => {
    const endpoint = `${prefix}/generateValidation`
    try {
        const response = await axios.put<boolean>(endpoint)
        Helper.validateResponse(response)

        return response.data
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const validate = async (validationCode: number): Promise<User> => {
    const endpoint = `${prefix}/validate/${validationCode}`
    try {
        const response = await axios.put<Token>(endpoint, validationCode)
        Helper.validateResponse(response)

        const user = sessionCreate(response.data)

        return user
    } catch (error: any) {
        const errorMessage = `Error fetching ${endpoint}: '${error}'`
        console.error(errorMessage)
        throw new Error(error)
    }
}

const Users = {
    getOneUser,
    login,
    logout,
    register,
    sessionGet,
    validationStart,
    validate,
}

export default Users
