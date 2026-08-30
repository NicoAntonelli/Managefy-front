import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Sale from '@/entities/sales/Sale'
import SaleC from '@/entities/sales/SaleC'
import SaleState from '@/entities/helpTypes/SaleState'

const prefix = `${Env.backendAPI}/sales`

const listSalesIncomplete = async (businessID: number): Promise<Sale[]> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.get<Sale[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const listSalesByClient = async (
    businessID: number,
    clientID: number
): Promise<Sale[]> => {
    const endpoint = `${prefix}/business/${businessID}/client/${clientID}`
    try {
        const response = await api.get<Sale[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const listSalesByInterval = async (
    businessID: number,
    dateFrom: string,
    dateTo: string
): Promise<Sale[]> => {
    const endpoint = `${prefix}/business/${businessID}/interval?from=${dateFrom}&to=${dateTo}`
    try {
        const response = await api.get<Sale[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneSale = async (id: number, businessID: number): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.get<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createSale = async (saleCreate: SaleC): Promise<Sale> => {
    const endpoint = prefix
    try {
        const response = await api.post<Sale>(endpoint, saleCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateSaleObservation = async (
    id: number,
    businessID: number,
    observation: string
): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/observation/${observation}`
    try {
        const response = await api.put<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateSaleState = async (
    id: number,
    businessID: number,
    state: SaleState
): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/state/${state}`
    try {
        const response = await api.put<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updatePartialPayment = async (
    id: number,
    businessID: number,
    partialPayment: number
): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/partialPayment/${partialPayment}`
    try {
        const response = await api.put<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateOrAddClientForSale = async (
    id: number,
    businessID: number,
    clientID: number
): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/client/${clientID}`
    try {
        const response = await api.put<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const eraseClientForSale = async (
    id: number,
    businessID: number
): Promise<Sale> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/eraseClient`
    try {
        const response = await api.put<Sale>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const cancelSale = async (id: number, businessID: number): Promise<number> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Sales = {
    listSalesIncomplete,
    listSalesByClient,
    listSalesByInterval,
    getOneSale,
    createSale,
    updateSaleObservation,
    updateSaleState,
    updatePartialPayment,
    updateOrAddClientForSale,
    eraseClientForSale,
    cancelSale,
}

export default Sales
