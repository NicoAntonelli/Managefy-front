import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Role from '@/entities/helpTypes/Role'
import UserRole from '@/entities/usersRoles/UserRole'

const prefix = `${Env.backendAPI}/userRoles`

const listUserRoles = async (): Promise<UserRole[]> => {
    const endpoint = prefix
    try {
        const response = await api.get<UserRole[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const listUserRolesByBusiness = async (
    businessID: number
): Promise<UserRole[]> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.get<UserRole[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneUserRoleForLogged = async (
    businessID: number
): Promise<UserRole> => {
    const endpoint = `${prefix}/loggedRole/business/${businessID}`
    try {
        const response = await api.get<UserRole>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneUserRoleForOther = async (
    userID: number,
    businessID: number
): Promise<UserRole> => {
    const endpoint = `${prefix}/user/${userID}/business/${businessID}`
    try {
        const response = await api.get<UserRole>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createUserRole = async (
    userID: number,
    businessID: number,
    role: Role
): Promise<UserRole> => {
    const endpoint = `${prefix}/user/${userID}/business/${businessID}/createRole/${role}`
    try {
        const response = await api.put<UserRole>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateUserRole = async (
    userID: number,
    businessID: number,
    role: Role
): Promise<UserRole> => {
    const endpoint = `${prefix}/user/${userID}/business/${businessID}/updateRole/${role}`
    try {
        const response = await api.put<UserRole>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const transferManagerRole = async (
    userID: number,
    businessID: number
): Promise<UserRole> => {
    const endpoint = `${prefix}/user/${userID}/business/${businessID}/transferManager`
    try {
        const response = await api.put<UserRole>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteUserRole = async (
    userID: number,
    businessID: number
): Promise<number> => {
    const endpoint = `${prefix}/user/${userID}/business/${businessID}`
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const leaveUserRole = async (businessID: number): Promise<number> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const UserRoles = {
    listUserRoles,
    listUserRolesByBusiness,
    getOneUserRoleForLogged,
    getOneUserRoleForOther,
    createUserRole,
    updateUserRole,
    transferManagerRole,
    deleteUserRole,
    leaveUserRole,
}

export default UserRoles
