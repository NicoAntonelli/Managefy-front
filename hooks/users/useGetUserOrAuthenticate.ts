import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import Helper from '@/services/helper'
import Users from '@/services/users'

import useSessionReloadStore from '@/hooks/stores/useSessionReloadStore'

import User from '@/entities/users/User'

// Pages that an unvalidated user can still access when redirect is true
const unvalidatedAllowedPaths = ['/users/validation', '/users/profile']

// Get current user, optionally redirect to login/register or validation
const useGetUserOrAuthenticate = (redirect: boolean) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const reloadKey = useSessionReloadStore((state) => state.reloadKey)

    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        let active = true

        const fetchUser = async () => {
            let sessionUser: User | null = null

            try {
                sessionUser = await Users.sessionGet()
            } catch (error) {
                console.error(error)
                Helper.parseLogError(error)
            }

            if (!active) return

            if (!sessionUser?.email) {
                // No logged in user found in session
                if (redirect) {
                    // Loading stays true while redirecting
                    router.push('/users/loginRegister')
                    return
                }

                sessionUser = null
            } else if (
                redirect &&
                !sessionUser.validated &&
                !unvalidatedAllowedPaths.includes(pathname)
            ) {
                // Logged in user found but not validated
                router.push('/users/validation')
                return
            }

            setUser(sessionUser)
            setLoading(false)
        }
        fetchUser()

        return () => {
            active = false
        }
    }, [redirect, reloadKey, router, pathname])

    return { user, loading }
}

export default useGetUserOrAuthenticate
