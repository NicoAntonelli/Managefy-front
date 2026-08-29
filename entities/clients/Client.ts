interface Client {
    id: number
    name: string
    description: string
    email: string
    phone: string
    deletionDate?: Date | null
}

export default Client
