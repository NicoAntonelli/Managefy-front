interface UserUpdate {
    id: number
    email: string
    password: string
    name: string
    validated: boolean
    emailNotifications: boolean
}

export default UserUpdate
