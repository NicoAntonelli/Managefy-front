import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'

interface InputTextProps {
    withAsterisk?: boolean
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputText = (props: InputTextProps) => {
    const { withAsterisk, label, placeholder, leftIcon, InputProps } = props

    return (
        <TextInput
            pt="1rem"
            withAsterisk={withAsterisk}
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...InputProps}
        />
    )
}

export default InputText
