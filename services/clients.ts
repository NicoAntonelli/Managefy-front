import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Client from '@/entities/clients/Client'
import ClientCU from '@/entities/clients/ClientCU'

const prefix = `${Env.backendAPI}/clients`

const listClients = async (businessID: number): Promise<Client[]> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.get<Client[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneClient = async (
    id: number,
    businessID: number
): Promise<Client> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.get<Client>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createClient = async (clientCreate: ClientCU): Promise<Client> => {
    const endpoint = prefix
    try {
        const response = await api.post<Client>(endpoint, clientCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateClient = async (clientUpdate: ClientCU): Promise<Client> => {
    const endpoint = prefix
    try {
        const response = await api.put<Client>(endpoint, clientUpdate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteClient = async (
    id: number,
    businessID: number
): Promise<number> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.delete<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Clients = {
    listClients,
    getOneClient,
    createClient,
    updateClient,
    deleteClient,
}

export default Clients
