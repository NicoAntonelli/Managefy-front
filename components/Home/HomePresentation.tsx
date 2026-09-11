import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Group, Image, Stack, Text, Title } from '@mantine/core'

import Theme from '@/app/theme'

interface HomePresentationProps {
    hideBorder?: boolean
    isTermsAndConditions?: boolean
}

const HomePresentation = (props: HomePresentationProps) => {
    const { hideBorder = false, isTermsAndConditions = false } = props
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.md})`)

    return (
        <Card
            shadow={hideBorder ? 'null' : 'sm'}
            padding="lg"
            radius="md"
            withBorder={!hideBorder}
            w="100%">
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
                        {isTermsAndConditions ? (
                            <>
                                <Title size={isMobile ? '1.5rem' : '3.5rem'}>
                                    Términos y Condiciones de Uso
                                </Title>
                                <Text
                                    size={isMobile ? '1rem' : '1.75rem'}
                                    mt={isMobile ? '0.5rem' : '1.5rem'}>
                                    Última actualización: <b>24/11/2025</b>
                                </Text>
                            </>
                        ) : (
                            <Text
                                size={isMobile ? '1rem' : '1.75rem'}
                                mt={isMobile ? '0.5rem' : '1.5rem'}>
                                <b>
                                    Gestión de recursos fácil de usar para su
                                    emprendimiento
                                </b>
                            </Text>
                        )}
                    </Stack>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default HomePresentation
