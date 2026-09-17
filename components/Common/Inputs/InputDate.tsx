import { DateInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

interface InputDateProps {
    label: string
    value: string | null
    disabled?: boolean
    flex?: number | string
    onChange: (value: string | null) => void
}

const InputDate = (props: InputDateProps) => {
    const { label, value, disabled, flex, onChange } = props

    return (
        <DateInput
            label={label}
            value={value}
            onChange={onChange}
            disabled={disabled}
            flex={flex}
            valueFormat="DD/MM/YYYY"
            leftSection={<IconCalendar size={16} />}
        />
    )
}

export default InputDate
