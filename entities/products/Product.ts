import Supplier from '@/entities/suppliers/Supplier'

interface Product {
    id: number
    code: string
    name: string
    description: string
    unitCost: number
    unitPrice: number
    stock: number
    stockMin?: number | null
    saleMinAmount?: number | null
    deletionDate?: Date | null
    supplier?: Supplier | null
}

export default Product
