import React from 'react'
import Link from 'next/link'
import { Button, Stack, Text, Title } from '@mantine/core'
import { IconBuildingStore, IconHexagonPlus } from '@tabler/icons-react'

import TextHelper from '@/utils/string/TextHelper'
import Theme from '@/app/theme'

import ResourceName from '@/entities/helpTypes/ResourceName'

interface BusinessWelcomeProps {
    resourceName: ResourceName
}

const BusinessWelcome = (props: BusinessWelcomeProps) => {
    const { resourceName } = props

    const isBusinessPage = resourceName === 'emprendimiento'
    const pluralResourceName = TextHelper.pluralResourceName(resourceName)

    return (
        <Stack align="center" gap="md" py="xl">
            <Title size="2rem">
                {isBusinessPage
                    ? 'Da el primer paso con tu emprendimiento'
                    : `Selecciona un emprendimiento para ver sus ${pluralResourceName}`}
            </Title>
            {!isBusinessPage && (
                <Button
                    color={Theme.primaryColor}
                    w={{ base: '100%', sm: 'fit-content' }}
                    leftSection={<IconBuildingStore size={24} />}>
                    <Link href="/businesses">Ir a emprendimientos</Link>
                </Button>
            )}
            <Text ta="center" maw={480}>
                {isBusinessPage
                    ? 'Aún no tienes emprendimientos. Empieza '
                    : 'Si aún no tienes emprendimientos, empieza '}
                creando el primero y reúne tu trabajo en un solo lugar.
            </Text>
            <Button
                color={Theme.other!.secondaryColor}
                w={{ base: '100%', sm: 'fit-content' }}
                leftSection={<IconHexagonPlus size={24} />}>
                <Link href="/businesses/new">
                    Crea tu primer emprendimiento
                </Link>
            </Button>
        </Stack>
    )
}

export default BusinessWelcome
