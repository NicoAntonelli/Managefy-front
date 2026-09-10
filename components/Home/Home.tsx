import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stack } from '@mantine/core'

import Health from '@/services/health'
import Helper from '@/services/helper'

import HomePresentation from '@/components/Home/HomePresentation'
import LoginRegister from '@/components/User/LoginRegister/LoginRegister'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

const getHealth = async () => {
    try {
        const health = await Health.testAPI()
        console.log(health)
    } catch (error) {
        console.log(
            'No se puede conectar con la API de Managefy en este momento. Inténtalo de nuevo más tarde.'
        )
    }
}

const Home = () => {
    useEffect(() => {
        getHealth()

        const fetchUser = async () => {
            try {
                const user = await Helper.getUserOrAuthenticate(router, false)
                if (user?.email) {
                    if (user.validated) router.push('/businesses')
                    else router.push('/users/validation')
                }
            } catch (error) {
                // Can't fetch user nor log error, stay on home page
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="2rem" align="center" w="100%" maw="75rem" mx="auto">
            <HomePresentation />
            <LoginRegister />
        </Stack>
    )
}

export default Home
