import React from 'react'
import Link from 'next/link'
import { Button, Stack, Text, Title } from '@mantine/core'
import { IconBuildingStore, IconHexagonPlus } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface BusinessSelectionProps {
    resourceName: string
    isBusinessPage?: boolean
}

const BusinessSelection = ({
    resourceName,
    isBusinessPage = false,
}: BusinessSelectionProps) => (
    <Stack align="center" gap="md" py="xl">
        <Title size="2rem">
            {isBusinessPage
                ? 'Da el primer paso con tu emprendimiento'
                : `Selecciona un emprendimiento para ver sus ${resourceName}`}
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
                ? 'Aún no tienes emprendimientos. '
                : 'Si aún no tienes emprendimientos, '}
            Empieza creando el primero y reúne tu trabajo en un solo lugar.
        </Text>
        <Button
            color="orange.6"
            w={{ base: '100%', sm: 'fit-content' }}
            leftSection={<IconHexagonPlus size={24} />}>
            <Link href="/businesses/new">Crea tu primer emprendimiento</Link>
        </Button>
    </Stack>
)

export default BusinessSelection
