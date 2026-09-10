import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'
import { IconPhone } from '@tabler/icons-react'

import RegEx from '@/utils/string/RegEx'

interface InputPhoneProps {
    required?: boolean
    name: string
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputPhone = (props: InputPhoneProps) => {
    const { name, required, InputProps } = props

    return (
        <TextInput
            name={name}
            pt="1rem"
            required={required}
            withAsterisk={required}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label="Teléfono"
            placeholder="Número de teléfono"
            leftSection={<IconPhone />}
            {...InputProps}
            onChange={(event) => {
                event.currentTarget.value = RegEx.cleanInteger(
                    event.currentTarget.value
                )
                InputProps?.onChange?.(event)
            }}
        />
    )
}

export default InputPhone
