interface SupplierCU {
    id?: number
    name: string
    description: string
    email: string
    phone: string
    businessID: number
    productsIDs?: number[] | null
}

export default SupplierCU
