import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'
import Constant from '@/utils/validation/Constant'

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
            withAsterisk={required}
            maxLength={Constant.MAX_STRING_SIZE_TITLE}
            flex={flex}
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...InputProps}
        />
    )
}

export default InputText
