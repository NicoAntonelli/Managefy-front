import type { ReactNode } from 'react'
import { DateInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

import Constant from '@/utils/validation/Constant'
import DateHelper from '@/utils/math/DateHelper'

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

    const today = DateHelper.today()
    const minDate = new Date(
        today.setMonth(today.getMonth() - Constant.MAX_PREVIOUS_MONTHS)
    )

    return (
        <DateInput
            label={label}
            value={value}
            onChange={onChange}
            disabled={disabled}
            minDate={minDate}
            maxDate={DateHelper.tomorrow()}
            flex={flex}
            error={error}
            valueFormat="DD/MM/YYYY"
            leftSection={<IconCalendar size={16} />}
        />
    )
}

export default InputDate
