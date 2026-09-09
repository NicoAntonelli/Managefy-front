import React from 'react'
import Link from 'next/link'
import { Button } from '@mantine/core'
import { IconHexagonPlus } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface ButtonCreateProps {
    href: string
    resourceName: string
}

const ButtonCreate = (props: ButtonCreateProps) => {
    const { href, resourceName } = props

    return (
        <Button
            component={Link}
            href={href}
            color={Theme.other!.secondaryColor}
            w={{ base: '100%', sm: 'fit-content' }}
            leftSection={<IconHexagonPlus size={24} />}>
            Crear un nuevo {resourceName}
        </Button>
    )
}

export default ButtonCreate
