import type { InputHTMLAttributes } from 'react'
import { PasswordInput } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'

interface InputPasswordProps {
    required?: boolean
    isConfirmation?: boolean
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputPassword = (props: InputPasswordProps) => {
    const { isConfirmation, InputProps } = props

    return (
        <PasswordInput
            pt="1rem"
            required
            withAsterisk
            maxLength={100}
            type="password"
            label="Contraseña"
            placeholder={isConfirmation ? 'Confirmar contraseña' : 'Contraseña'}
            leftSection={<IconLock />}
            {...InputProps}
        />
    )
}

export default InputPassword
