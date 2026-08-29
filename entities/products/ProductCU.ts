import SupplierCU from '@/entities/suppliers/SupplierCU'

interface ProductCU {
    id: number
    code: string
    name: string
    description: string
    unitCost: number
    unitPrice: number
    stock: number
    stockMin?: number | null
    saleMinAmount?: number | null
    businessID: number
    supplier?: SupplierCU | null
}

export default ProductCU
