import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Stack } from '@mantine/core'

import Health from '@/services/health'
import useGetUserOrAuthenticate from '@/hooks/users/useGetUserOrAuthenticate'

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
    const { user, loading } = useGetUserOrAuthenticate(false)

    const router = useRouter()

    useEffect(() => {
        getHealth()
    }, [])

    useEffect(() => {
        if (loading || !user) return

        if (user.validated) router.push('/businesses')
        else router.push('/users/validation')
    }, [user, loading, router])

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
