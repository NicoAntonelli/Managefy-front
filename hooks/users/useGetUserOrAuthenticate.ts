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

    const needReload = useSessionReloadStore((state) => state.needReload)
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)

    const router = useRouter()

    useEffect(() => {
        let active = true

        // Reload flag value when this fetch started
        const reloadAtStart = needReload

        const fetchUser = async () => {
            let redirecting = false

            try {
                const sessionUser: User | null = await Users.sessionGet()
                if (!sessionUser?.email) {
                    console.log('No valid user found in session')

                    if (redirect) {
                        redirecting = true
                        router.push('/users/loginRegister')
                        return
                    }

                    if (active) setUser(null)

                    return
                }

                if (active) setUser(sessionUser)
            } catch (error) {
                console.error(error)
                Helper.parseLogError(error)

                if (redirect) {
                    redirecting = true
                    router.push('/users/loginRegister')

                    return
                }

                if (active) setUser(null)
            } finally {
                if (active && !redirecting) setLoading(false)

                // Set the reload flag to false if it hasn't changed since this fetch started
                const reloadAtEnd = useSessionReloadStore.getState().needReload
                if (active && reloadAtStart === reloadAtEnd) {
                    setNeedReload(false)
                }
            }
        }
        fetchUser()

        return () => {
            active = false
        }
    }, [redirect, needReload, setNeedReload])

    return { user, loading }
}

export default useGetUserOrAuthenticate
