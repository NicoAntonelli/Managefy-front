import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { useRouter } from 'next/navigation'

import Health from '@/services/health'
import Helper from '@/services/helper'
import Theme from '@/app/theme'

import LoginRegister from '@/components/User/LoginRegister/LoginRegister'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import { Card, Group, Image, Stack, Text } from '@mantine/core'

const getHealth = async () => {
    try {
        const health = await Health.testAPI()
        console.log(health)
    } catch (error) {
        console.log("Can't connect to Managefy API right now. Try again later.")
    }
}

const Home = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
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
        <Stack gap="2rem" align="center">
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Card.Section p="1rem">
                    <Group
                        justify="flex-start"
                        gap={isMobile ? '1rem' : '2rem'}>
                        <Image
                            src="/Managefy-logo.jpeg"
                            alt="Managefy logo"
                            h={isMobile ? 150 : 350}
                            w="auto"
                            radius="md"
                        />
                        <Stack gap="0.25rem">
                            <Text size={isMobile ? '2rem' : '6rem'}>
                                Managefy
                            </Text>
                            <Text
                                size={isMobile ? '1rem' : '2rem'}
                                mt={isMobile ? '0.5rem' : '1.5rem'}
                                mr="1rem">
                                <b>
                                    Gestión de recursos fácil de usar para su
                                    negocio
                                </b>
                            </Text>
                        </Stack>
                    </Group>
                </Card.Section>
            </Card>
            <LoginRegister />
        </Stack>
    )
}

export default Home
