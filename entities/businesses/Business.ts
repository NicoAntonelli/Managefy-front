interface Business {
    id: number
    name: string
    description: string
    link: string
    isPublic: boolean
    businessDays: Record<string, boolean>
}

export default Business
