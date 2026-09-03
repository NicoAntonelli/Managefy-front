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
                ? 'Your business hub is waiting'
                : `Select a business to view its ${resourceName}`}
        </Title>
        {!isBusinessPage && (
            <Button
                color={Theme.primaryColor}
                w={{ base: '100%', sm: 'fit-content' }}
                leftSection={<IconBuildingStore size={24} />}>
                <Link href="/businesses">Go to businesses</Link>
            </Button>
        )}
        <Text ta="center" maw={480}>
            {isBusinessPage
                ? "You don't have any businesses yet. "
                : "If you don't have any businesses yet, "}
            Start by creating your first one and bring your work into one place.
        </Text>
        <Button
            color="orange.6"
            w={{ base: '100%', sm: 'fit-content' }}
            leftSection={<IconHexagonPlus size={24} />}>
            <Link href="/businesses/new">Create your first business</Link>
        </Button>
    </Stack>
)

export default BusinessSelection
