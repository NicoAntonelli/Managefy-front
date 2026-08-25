import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Business from '@/entities/businesses/Business'

const prefix = `${Env.backendAPI}/businesses`

const listBusinesses = async (): Promise<Business[]> => {
    const endpoint = prefix
    try {
        const response = await api.get<Business[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneBusiness = async (id: number): Promise<Business> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await api.get<Business>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneBusinessByLink = async (link: string): Promise<Business> => {
    const endpoint = `${prefix}/link/${link}`
    try {
        const response = await api.get<Business>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneBusinessByLinkPublic = async (link: string): Promise<Business> => {
    const endpoint = `${prefix}/linkPublic/${link}`
    try {
        const response = await api.get<Business>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createBusiness = async (businessCreate: Business): Promise<Business> => {
    const endpoint = prefix
    try {
        const response = await api.post<Business>(endpoint, businessCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateBusiness = async (businessUpdate: Business): Promise<Business> => {
    const endpoint = prefix
    try {
        const response = await api.put<Business>(endpoint, businessUpdate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteBusiness = async (id: number): Promise<number> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Businesses = {
    listBusinesses,
    getOneBusiness,
    getOneBusinessByLink,
    getOneBusinessByLinkPublic,
    createBusiness,
    updateBusiness,
    deleteBusiness,
}

export default Businesses
