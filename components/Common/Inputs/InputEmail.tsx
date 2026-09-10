import type { InputHTMLAttributes } from 'react'
import { TextInput } from '@mantine/core'
import { IconMail } from '@tabler/icons-react'

interface InputEmailProps {
    required?: boolean
    flex?: number | string
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputEmail = (props: InputEmailProps) => {
    const { required, flex, InputProps } = props

    return (
        <TextInput
            pt="1rem"
            required={required}
            flex={flex}
            withAsterisk={required}
            label="Email"
            placeholder="correo@mail.com"
            leftSection={<IconMail />}
            type="email"
            inputMode="email"
            {...InputProps}
        />
    )
}

export default InputEmail
