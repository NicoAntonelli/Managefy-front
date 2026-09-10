import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'

interface InputTextProps {
    required?: boolean
    flex?: number | string
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputText = (props: InputTextProps) => {
    const { required, flex, label, placeholder, leftIcon, InputProps } = props

    return (
        <TextInput
            pt="1rem"
            required={required}
            flex={flex}
            withAsterisk={required}
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...InputProps}
        />
    )
}

export default InputText
