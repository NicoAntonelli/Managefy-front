import { useCallback, useEffect, useState } from 'react'

import UserRoles from '@/services/userRoles'

import UserRole from '@/entities/userRoles/UserRole'

// Get the logged user's role for a business (null if the user has no role in it)
const useGetUserRole = (businessID?: number) => {
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)

    const [reloadKey, setReloadKey] = useState(0)
    const reload = useCallback(() => setReloadKey((key) => key + 1), [])

    useEffect(() => {
        // The fetch waits until the businessID is defined
        if (!businessID) return

        let active = true

        const fetchUserRole = async () => {
            let loggedRole: UserRole | null = null

            try {
                loggedRole = await UserRoles.getOneUserRoleForLogged(businessID)
            } catch (error) {
                // The user may not have a role in the business, like in public businesses
            }

            if (!active) return

            setUserRole(loggedRole ?? null)
            setLoading(false)
        }
        fetchUserRole()

        return () => {
            active = false
        }
    }, [businessID, reloadKey])

    return { userRole, loading, reload }
}

export default useGetUserRole
