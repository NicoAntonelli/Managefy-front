import WeekDay from '../helpTypes/WeekDay'

interface Business {
    id: number
    name: string
    description: string
    link: string
    isPublic: boolean
    businessDays: Record<WeekDay, boolean>
}

export default Business
