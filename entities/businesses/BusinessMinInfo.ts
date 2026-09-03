import Role from '@/entities/helpTypes/Role'

interface BusinessMinInfo {
    id: number
    name: string
    isPublic?: boolean
    currentUserRole?: Role
}

export default BusinessMinInfo
