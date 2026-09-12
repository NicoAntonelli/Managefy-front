import Link from 'next/link'
import { Button, Group } from '@mantine/core'
import { ReactNode } from 'react'

import Operation from '@/entities/helpTypes/Operation'
import TextHelper from '@/utils/string/TextHelper'

interface ButtonsSubmitAndCancelProps {
    operation: Operation
    operationText?: string
    resource?: string
    leftIcon: ReactNode
    submitting: boolean
    disabled?: boolean
    cancelHref?: string
    onCancel?: () => void
}

const ButtonsSubmitAndCancel = (props: ButtonsSubmitAndCancelProps) => {
    const { operation, operationText, resource, leftIcon } = props
    const { submitting, disabled, cancelHref, onCancel } = props

    const action = operationText ?? TextHelper.getOperationText(operation)
    const color = TextHelper.getOperationColor(operation)

    return (
        <Group justify="flex-end" mt="2rem">
            {onCancel ? (
                <Button
                    onClick={onCancel}
                    variant="default"
                    disabled={submitting}>
                    Cancelar
                </Button>
            ) : cancelHref ? (
                <Button
                    component={Link}
                    href={cancelHref}
                    variant="default"
                    disabled={submitting}>
                    Cancelar
                </Button>
            ) : null}
            <Button
                type="submit"
                color={color}
                leftSection={leftIcon}
                loading={submitting}
                disabled={disabled}>
                {`${action}${resource ? ` ${resource}` : ''}`}
            </Button>
        </Group>
    )
}

export default ButtonsSubmitAndCancel
