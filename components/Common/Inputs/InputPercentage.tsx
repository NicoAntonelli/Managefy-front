import Constant from '@/utils/validation/Constant'

import InputNumeric from '@/components/Common/Inputs/InputNumeric'

interface InputPercentageProps {
    label?: string
    ariaLabel?: string
    value: number | null
    onChange: (value: number | null) => void
}

const InputPercentage = (props: InputPercentageProps) => {
    const { label, ariaLabel, value, onChange } = props

    return (
        <InputNumeric
            name="percentage"
            label={label}
            aria-label={ariaLabel}
            hideControls
            allowNegative
            InputProps={{
                'aria-label': ariaLabel,
                min: Constant.MIN_PERCENTAGE,
                max: Constant.MAX_PERCENTAGE,
                value: value ?? undefined,
                onChange: (value) =>
                    onChange(value === null ? null : Number(value)),
            }}
        />
    )
}

export default InputPercentage
