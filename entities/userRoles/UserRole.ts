import Business from '@/entities/businesses/Business'
import User from '@/entities/users/User'

interface UserRole {
    user: User
    business: Business
    isManager: boolean
    isAdmin: boolean
    isCollaborator: boolean
}

export default UserRole
