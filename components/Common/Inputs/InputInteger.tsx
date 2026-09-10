import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'

import RegEx from '@/utils/string/RegEx'

interface InputIntegerProps {
    withAsterisk?: boolean
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    name: string
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputInteger = (props: InputIntegerProps) => {
    const { name, withAsterisk, label, placeholder, leftIcon, InputProps } =
        props

    return (
        <TextInput
            name={name}
            pt="1rem"
            withAsterisk={withAsterisk}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
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

export default InputInteger
