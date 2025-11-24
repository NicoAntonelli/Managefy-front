import React from 'react'
import Link from 'next/link'
import { Button, Card, Group, Image, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from '@/app/theme'

const About = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    return (
        <>
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={isMobile ? 'min-w-full' : 'w-screen-l'}>
                <Card.Section p="1rem">
                    <Group
                        justify="flex-start"
                        gap={isMobile ? '1rem' : '2rem'}>
                        <Image
                            src="/Managefy-logo.jpeg"
                            alt="Managefy banner"
                            w="25%"
                            radius="md"
                        />
                        <Stack gap="0.25rem">
                            <Text size={isMobile ? '2rem' : '6rem'}>
                                Managefy
                            </Text>
                            <Text size={isMobile ? 'sm' : 'xl'} mt="0.5rem">
                                <b>
                                    Gestión de recursos fácil de usar para su
                                    negocio
                                </b>
                            </Text>
                        </Stack>
                    </Group>
                </Card.Section>

                <Text size="sm" mt="1rem">
                    Managefy es una app para administrar y gestionar mejor tu
                    empresa o negocio, con herramientas útiles y fáciles de usar
                    como gestión de stock, clientes y ventas, entre otras, que
                    todo emprendedor necesita. Además, te permite analizar el
                    progreso de tu negocio con múltiples gráficos fáciles de
                    entender... en una sola app gratuita.
                </Text>
                <Text size="sm" mt="1rem">
                    Managefy es un mini ERP (Sistema de Planificación de
                    Recursos Empresariales) con las características y
                    complejidad adecuadas para poder gestionar una pequeña
                    empresa fácilmente por un usuario común que además puede
                    obtener resultados gráficos y estadísticos de forma
                    sencilla.
                </Text>
            </Card>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                mt="3rem"
                withBorder
                className="min-w-full">
                <Text size="2rem">Desarrollo</Text>
                <Text size="sm" mt="0.5rem">
                    <b>@NicoAntonelli</b>
                </Text>
                <Text size="sm">
                    Managefy fue realizada por Nicolás Antonelli
                </Text>

                <Button mt="md" radius="md">
                    <Link
                        target="_blank"
                        href="https://github.com/NicoAntonelli"
                        style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        Visitar GitHub.com/NicoAntonelli
                    </Link>
                </Button>
                <Button color="orange.6" mt="md" radius="md">
                    <Link
                        target="_blank"
                        href="https://github.com/NicoAntonelli/Managefy"
                        style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        Visitar repo backend de Managefy
                    </Link>
                </Button>
                <Button color="orange.6" mt="md" radius="md">
                    <Link
                        target="_blank"
                        href="https://github.com/NicoAntonelli/Managefy-front"
                        style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        Visitar repo frontend de Managefy
                    </Link>
                </Button>
            </Card>
        </>
    )
}

export default About
