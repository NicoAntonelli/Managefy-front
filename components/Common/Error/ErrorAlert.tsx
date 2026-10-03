import React from 'react'
import { Alert, Center } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface ErrorAlertProps {
    message?: string
    color?: string
}

const ErrorAlert = (props: ErrorAlertProps) => {
    const { message, color } = props

    return (
        <Center mih="100vh" p="xl">
            <Alert
                variant="light"
                color={color ?? Theme.other!.danger}
                title="Error"
                icon={<IconAlertTriangle />}
                maw={480}>
                {message ?? 'Ocurrió un error inesperado.'}
            </Alert>
        </Center>
    )
}

export default ErrorAlert
