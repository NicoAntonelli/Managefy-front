import type { ReactNode } from 'react'
import { NumberInput } from '@mantine/core'

import Constant from '@/utils/validation/Constant'
import NumberInputPropsSimple from '@/entities/helpTypes/NumberInputPropsSimple'

interface InputNumericProps {
    required?: boolean
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    name: string
    isInteger?: boolean
    hideControls?: boolean
    InputProps?: NumberInputPropsSimple
}

const InputNumeric = (props: InputNumericProps) => {
    const {
        name,
        required,
        label,
        placeholder,
        leftIcon,
        isInteger = false,
        hideControls = false,
        InputProps,
    } = props

    return (
        <NumberInput
            name={name}
            pt="1rem"
            required={required}
            withAsterisk={required}
            max={Constant.MAX_SAFE_NUMBER}
            maxLength={16}
            inputMode={isInteger ? 'numeric' : 'decimal'}
            allowNegative={false}
            allowDecimal={!isInteger}
            decimalScale={isInteger ? 0 : 2}
            hideControls={hideControls}
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...InputProps}
            onChange={(value) => {
                InputProps?.onChange?.(value === '' ? null : value)
            }}
        />
    )
}

export default InputNumeric
