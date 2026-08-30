import WeekDay from '@/entities/helpTypes/WeekDay'

interface BusinessCU {
    id?: number
    name: string
    description: string
    link: string
    isPublic: boolean
    businessDays: Record<WeekDay, boolean>
}

export default BusinessCU
