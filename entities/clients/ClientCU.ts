interface ClientCU {
    id?: number
    name: string
    description: string
    email: string
    phone: string
    businessID: number
    salesIDs?: number[] | null
}

export default ClientCU
