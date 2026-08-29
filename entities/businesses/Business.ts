import WeekDay from '../helpTypes/WeekDay'

// Also used as "BusinessCU"
interface Business {
    id: number
    name: string
    description: string
    link: string
    isPublic: boolean
    businessDays: Record<WeekDay, boolean>
}

export default Business
