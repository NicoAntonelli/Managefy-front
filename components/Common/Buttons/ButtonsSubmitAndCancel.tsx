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
    onCancel?: () => void
}

const ButtonsSubmitAndCancel = (props: ButtonsSubmitAndCancelProps) => {
    const { text, leftIcon, isCreate, submitting, cancelHref, onCancel } = props

    const action = isCreate ? 'Crear' : 'Actualizar'

    return (
        <Group justify="flex-end" mt="2rem">
            {onCancel ? (
                <Button onClick={onCancel} variant="default">
                    Cancelar
                </Button>
            ) : (
                <Button component={Link} href={cancelHref} variant="default">
                    Cancelar
                </Button>
            )}
            <Button
                type="submit"
                color={
                    isCreate ? Theme.primaryColor : Theme.other!.secondaryColor
                }
                leftSection={leftIcon}
                loading={submitting}>
                {`${action} ${text}`}
            </Button>
        </Group>
    )
}

export default ButtonsSubmitAndCancel
