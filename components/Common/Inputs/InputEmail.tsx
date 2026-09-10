import type { InputHTMLAttributes } from 'react'
import { TextInput } from '@mantine/core'
import { IconMail } from '@tabler/icons-react'

interface InputTextProps {
    withAsterisk?: boolean
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputEmail = (props: InputTextProps) => {
    const { withAsterisk, InputProps } = props

    return (
        <TextInput
            pt="1rem"
            withAsterisk={withAsterisk}
            label="persona@example.com"
            placeholder="Email"
            leftSection={<IconMail />}
            type="email"
            inputMode="email"
            {...InputProps}
        />
    )
}

export default InputEmail
