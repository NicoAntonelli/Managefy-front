import Link from 'next/link'
import { Button, Group } from '@mantine/core'
import { ReactNode } from 'react'

import Theme from '@/app/theme'

interface ButtonsSubmitAndCancelProps {
    text: string
    leftIcon: ReactNode
    isCreate: boolean
    submitting: boolean
    cancelHref: string
}

const ButtonsSubmitAndCancel = ({
    text,
    leftIcon,
    isCreate,
    submitting,
    cancelHref,
}: ButtonsSubmitAndCancelProps) => {
    const action = isCreate ? 'Crear' : 'Actualizar'

    return (
        <Group justify="flex-end" mt="2rem">
            <Button component={Link} href={cancelHref} color="red">
                Cancelar
            </Button>
            <Button
                type="submit"
                color={isCreate ? Theme.primaryColor : 'orange.6'}
                leftSection={leftIcon}
                disabled={submitting}>
                {submitting ? 'Cargando...' : `${action} ${text}`}
            </Button>
        </Group>
    )
}

export default ButtonsSubmitAndCancel
