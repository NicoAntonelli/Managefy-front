import api from './api'
import decodeToken from '@/middlewares/decodeToken'
import Env from '@/utils/Env'
import Helper from './helper'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'
import SessionResponse from '@/entities/helpTypes/SessionResponse'
import Token from '@/entities/Token'
import User from '@/entities/User'
import UserUpdate from '@/entities/UserUpdate'

const prefix = `${Env.backendAPI}/users`

const listUsers = async (id: number): Promise<User[]> => {
    const endpoint = prefix
    try {
        const response = await api.get<User[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneUser = async (id: number): Promise<User> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await api.get<User>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const login = async (loginData: Login): Promise<User> => {
    const endpoint = `${prefix}/login`
    try {
        const response = await api.post<Token>(endpoint, loginData)
        Helper.validateResponseAPI(response)

        const user = sessionPost(response.data)

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const register = async (registration: Registration): Promise<User> => {
    const endpoint = `${prefix}/register`
    try {
        const response = await api.post<Token>(endpoint, registration)

        Helper.validateResponseAPI(response)

        const user = sessionPost(response.data)

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateUser = async (userUpdate: UserUpdate): Promise<User> => {
    const endpoint = prefix
    try {
        const response = await api.put<Token>(endpoint, userUpdate)
        Helper.validateResponseAPI(response)

        const user = sessionPost(response.data)

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const generateValidation = async (): Promise<boolean> => {
    const endpoint = `${prefix}/generateValidation`
    try {
        const response = await api.put<boolean>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const validate = async (validationCode: number): Promise<User> => {
    const endpoint = `${prefix}/validate/${validationCode}`
    try {
        const response = await api.put<Token>(endpoint, validationCode)
        Helper.validateResponseAPI(response)

        const user = sessionPost(response.data)

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteUser = async (): Promise<number> => {
    const endpoint = prefix
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

// No backend API call, just reads the session cookie
const sessionGet = async (): Promise<User | null> => {
    const endpoint = `${Env.baseURL}/api/session`
    try {
        const response = await api.get<SessionResponse>(endpoint)
        if (!response?.data) return null

        const { message, cookieExists } = response.data
        if (!cookieExists) return null

        const user: User | null = decodeToken(message)
        if (!user) throw new Error('Error decoding token')

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

// No backend API call, just sets or replaces a session cookie
const sessionPost = async (token: Token): Promise<User> => {
    const endpoint = `${Env.baseURL}/api/session`
    try {
        if (!token.accessToken) {
            throw new Error('Access token is missing in the response')
        }

        const response = await api.post<string>(endpoint, token)
        Helper.validateResponseAPI(response)

        const user: User | null = decodeToken(token.accessToken)
        if (!user) throw new Error('Error decoding token')

        return user
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

// No backend API call, just deletes the session cookie
const sessionDelete = async (): Promise<void> => {
    const endpoint = `${Env.baseURL}/api/session`
    try {
        const response = await api.delete<string>(endpoint)
        Helper.validateResponseAPI(response)
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Users = {
    listUsers,
    getOneUser,
    login,
    register,
    updateUser,
    generateValidation,
    validate,
    deleteUser,
    sessionGet,
    sessionPost,
    sessionDelete,
}

export default Users
