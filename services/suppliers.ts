import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Supplier from '@/entities/suppliers/Supplier'
import SupplierCU from '@/entities/suppliers/SupplierCU'

const prefix = `${Env.backendAPI}/suppliers`

const listSuppliers = async (businessID: number): Promise<Supplier[]> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.get<Supplier[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneSupplier = async (
    id: number,
    businessID: number
): Promise<Supplier> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.get<Supplier>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createSupplier = async (supplierCreate: SupplierCU): Promise<Supplier> => {
    const endpoint = prefix
    try {
        const response = await api.post<Supplier>(endpoint, supplierCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateSupplier = async (supplierUpdate: SupplierCU): Promise<Supplier> => {
    const endpoint = prefix
    try {
        const response = await api.put<Supplier>(endpoint, supplierUpdate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteSupplier = async (
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

const Suppliers = {
    listSuppliers,
    getOneSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
}

export default Suppliers
