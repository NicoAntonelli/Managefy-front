import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Product from '@/entities/products/Product'
import ProductCU from '@/entities/products/ProductCU'

const prefix = `${Env.backendAPI}/products`

const listProducts = async (businessID: number): Promise<Product[]> => {
    const endpoint = `${prefix}/business/${businessID}`
    try {
        const response = await api.get<Product[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const listProductsBySupplier = async (
    businessID: number,
    supplierID: number
): Promise<Product[]> => {
    const endpoint = `${prefix}/business/${businessID}/suppliers/${supplierID}`
    try {
        const response = await api.get<Product[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneProduct = async (
    id: number,
    businessID: number
): Promise<Product> => {
    const endpoint = `${prefix}/${id}/business/${businessID}`
    try {
        const response = await api.get<Product>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createProduct = async (productCreate: ProductCU): Promise<Product> => {
    const endpoint = prefix
    try {
        const response = await api.post<Product>(endpoint, productCreate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateProduct = async (productUpdate: ProductCU): Promise<Product> => {
    const endpoint = prefix
    try {
        const response = await api.put<Product>(endpoint, productUpdate)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateProductStock = async (
    id: number,
    businessID: number,
    stock: number
): Promise<Product> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/stock/${stock}`
    try {
        const response = await api.put<Product>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateOrAddSupplierForProduct = async (
    id: number,
    businessID: number,
    supplierID: number
): Promise<Product> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/supplier/${supplierID}`
    try {
        const response = await api.put<Product>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const eraseSupplierForProduct = async (
    id: number,
    businessID: number
): Promise<Product> => {
    const endpoint = `${prefix}/${id}/business/${businessID}/eraseSupplier`
    try {
        const response = await api.put<Product>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const deleteProduct = async (
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

const Products = {
    listProducts,
    listProductsBySupplier,
    getOneProduct,
    createProduct,
    updateProduct,
    updateProductStock,
    updateOrAddSupplierForProduct,
    eraseSupplierForProduct,
    deleteProduct,
}

export default Products
