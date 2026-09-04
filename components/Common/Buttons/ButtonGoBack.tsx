import Link from 'next/link'
import { Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface ButtonGoBackProps {
    href: string
    text: string
}

const ButtonGoBack = ({ href, text }: ButtonGoBackProps) => {
    return (
        <Button
            component={Link}
            href={href}
            variant="subtle"
            color={Theme.primaryColor}
            leftSection={<IconArrowLeft size={18} />}
            className="button-go-back">
            Volver a {text}
        </Button>
    )
}

export default ButtonGoBack