import React from 'react'
import Link from 'next/link'
import { Button, Card, Stack, Text, Title } from '@mantine/core'
import Theme from '@/app/theme'

import HomePresentation from '@/components/Home/HomePresentation'

const About = () => {
    return (
        <Stack w="100%" maw="75rem" mx="auto">
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <HomePresentation hideBorder />

                <Text size="sm" mt="1rem">
                    Managefy es una app para administrar y gestionar mejor tu
                    empresa o emprendimiento, con herramientas útiles y fáciles
                    de usar como gestión de stock, clientes y ventas, entre
                    otras, que todo emprendedor necesita. Además, te permite
                    analizar el progreso de tu emprendimiento con múltiples
                    gráficos fáciles de entender... en una sola app gratuita.
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
                <Title size="2rem">Desarrollo</Title>
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
                <Button color={Theme.other!.secondaryColor} mt="md" radius="md">
                    <Link
                        target="_blank"
                        href="https://github.com/NicoAntonelli/Managefy"
                        style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        Visitar repo backend de Managefy
                    </Link>
                </Button>
                <Button color={Theme.other!.secondaryColor} mt="md" radius="md">
                    <Link
                        target="_blank"
                        href="https://github.com/NicoAntonelli/Managefy-front"
                        style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        Visitar repo frontend de Managefy
                    </Link>
                </Button>
            </Card>
        </Stack>
    )
}

export default About
