'use client'
import { Stack } from '@mantine/core'

import LoginRegister from '@/components/User/LoginRegister/LoginRegister'

const LoginRegisterPage = () => {
    return (
        <Stack w="100%" maw="40rem" mx="auto">
            <LoginRegister />
        </Stack>
    )
}

export default LoginRegisterPage
