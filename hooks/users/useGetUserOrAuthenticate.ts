import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Helper from '@/services/helper'
import Users from '@/services/users'

import useSessionReloadStore from '@/hooks/stores/useSessionReloadStore'

import User from '@/entities/users/User'

// Get current user, optionally redirect to login/register
const useGetUserOrAuthenticate = (redirect: boolean) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const reloadKey = useSessionReloadStore((state) => state.reloadKey)

    const router = useRouter()

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
                console.log('No valid user found in session')

                if (redirect) {
                    // Loading stays true while redirecting
                    router.push('/users/loginRegister')
                    return
                }

                sessionUser = null
            }

            setUser(sessionUser)
            setLoading(false)
        }
        fetchUser()

        return () => {
            active = false
        }
    }, [redirect, reloadKey, router])

    return { user, loading }
}

export default useGetUserOrAuthenticate
