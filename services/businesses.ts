import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Business from '@/entities/businesses/Business'
import BusinessCU from '@/entities/businesses/BusinessCU'
import BusinessResources from '@/entities/businesses/BusinessResources'

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

const getOneBusinessWithResourcesPublic = async (
    id: number
): Promise<BusinessResources> => {
    const endpoint = `${prefix}/${id}/publicResources`
    try {
        const response = await api.get<BusinessResources>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createBusiness = async (
    businessCreate: BusinessCU
): Promise<Business> => {
    const endpoint = prefix
    try {
        const response = await api.post<Business>(endpoint, businessCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateBusiness = async (
    businessUpdate: BusinessCU
): Promise<Business> => {
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
    getOneBusinessWithResourcesPublic,
    createBusiness,
    updateBusiness,
    deleteBusiness,
}

export default Businesses
