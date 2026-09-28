import type { ReactNode } from 'react'
import { NumberInput } from '@mantine/core'

import Constant from '@/utils/validation/Constant'
import NumberInputPropsSimple from '@/entities/helpTypes/NumberInputPropsSimple'

interface InputNumericProps {
    required?: boolean
    label?: string
    placeholder?: string
    leftIcon?: ReactNode
    name: string
    isInteger?: boolean
    allowNegative?: boolean
    hideControls?: boolean
    InputProps?: NumberInputPropsSimple
}

const InputNumeric = (props: InputNumericProps) => {
    const { name, required, label, placeholder, leftIcon } = props
    const { isInteger = false, allowNegative = false } = props
    const { hideControls = false, InputProps } = props

    const { value, ...restInputProps } = InputProps ?? {}

    return (
        <NumberInput
            name={name}
            pt="1rem"
            required={required}
            withAsterisk={required}
            max={Constant.MAX_SAFE_NUMBER}
            maxLength={16}
            inputMode={isInteger ? 'numeric' : 'decimal'}
            allowNegative={allowNegative}
            allowDecimal={!isInteger}
            decimalScale={isInteger ? 0 : 2}
            hideControls={hideControls}
            label={label}
            placeholder={placeholder}
            leftSection={leftIcon}
            {...restInputProps}
            value={value === null || value === undefined ? '' : value}
            onChange={(value) => {
                InputProps?.onChange?.(value === '' ? null : value)
            }}
        />
    )
}

export default InputNumeric
