import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Group, Image, Stack, Text, Title } from '@mantine/core'

import Theme from '@/app/theme'

const HomePresentation = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.md})`)

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
            <Card.Section p="1rem">
                <Group justify="flex-start" gap={isMobile ? '1rem' : '2rem'}>
                    <Image
                        src="/Managefy-logo.jpeg"
                        alt="Managefy logo"
                        h={isMobile ? 140 : 280}
                        w="auto"
                        radius="md"
                    />
                    <Stack gap="0.25rem">
                        <Title size={isMobile ? '2rem' : '4rem'}>
                            Managefy
                        </Title>
                        <Text
                            size={isMobile ? '1rem' : '1.75rem'}
                            mt={isMobile ? '0.5rem' : '1.5rem'}
                            mr="1rem">
                            <b>
                                Gestión de recursos fácil de usar para su
                                emprendimiento
                            </b>
                        </Text>
                    </Stack>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default HomePresentation
