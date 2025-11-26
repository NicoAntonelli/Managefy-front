import React, { useEffect } from 'react'
import Link from 'next/link'

import { Button, Flex, Group, Text, Title } from '@mantine/core'
import Helper from '@/services/helper'
import Theme from '@/app/theme'

const ErrorNotFound = () => {
    useEffect(() => {
        const endpoint = window.location.href.split('?')[0]
        const message = `Página o recurso no encontrado en ${endpoint}`
        Helper.parseLogError(message)
    }, [])

    return (
        <Flex mt={'2rem'} direction={'column'} align={'center'}>
            <Title mt={'2rem'} size={'2.5rem'}>
                MANAGEFY
            </Title>
            <Title size={'8rem'}>404</Title>
            <Text
                mt={'2rem'}
                pt={'2rem'}
                style={{ borderTop: '1px solid orange' }}>
                Error: Página o recurso no encontrado
            </Text>
            <Group mt={'2rem'}>
                <Link href="/">
                    <Button color={Theme.primaryColor}>Volver al inicio</Button>
                </Link>
            </Group>
            <Group mt={'2rem'}>
                <Link href="/help#reportBug">
                    <Button color="orange.6">Reportar bug</Button>
                </Link>
            </Group>
        </Flex>
    )
}

export default ErrorNotFound
