import type { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from '@mantine/core'

import RegEx from '@/utils/string/RegEx'

interface InputDecimalProps {
    withAsterisk?: boolean
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    name: string
    InputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
}

const InputDecimal = (props: InputDecimalProps) => {
    const { name, withAsterisk, label, placeholder, leftIcon, InputProps } =
        props

    return (
        <TextInput
            name={name}
            pt="1rem"
            withAsterisk={withAsterisk}
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...InputProps}
            onChange={(event) => {
                event.currentTarget.value = RegEx.cleanDecimal(
                    event.currentTarget.value
                )
                InputProps?.onChange?.(event)
            }}
        />
    )
}

export default InputDecimal
