import type { ReactNode } from 'react'
import { DateInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

interface InputDateProps {
    label: string
    value: string | null
    disabled?: boolean
    flex?: number | string
    error?: ReactNode
    onChange: (value: string | null) => void
}

const InputDate = (props: InputDateProps) => {
    const { label, value, disabled, flex, error, onChange } = props

    return (
        <DateInput
            label={label}
            value={value}
            onChange={onChange}
            disabled={disabled}
            flex={flex}
            error={error}
            valueFormat="DD/MM/YYYY"
            leftSection={<IconCalendar size={16} />}
        />
    )
}

export default InputDate
