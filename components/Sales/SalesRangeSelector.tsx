import React from 'react'
import { Checkbox, Group, Stack, Text } from '@mantine/core'

import InputDate from '@/components/Common/Inputs/InputDate'
import Constant from '@/utils/validation/Constant'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

interface SalesRangeSelectorProps {
    value: SalesDateRange | null
    onChange: (range: SalesDateRange | null) => void
}

const getDateInputValue = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const getDefaultRange = (): SalesDateRange => {
    const dateTo = new Date()
    const dateFrom = new Date()
    dateFrom.setMonth(dateFrom.getMonth() - Constant.DEFAULT_INTERVAL_MONTHS)

    return {
        dateFrom: getDateInputValue(dateFrom),
        dateTo: getDateInputValue(dateTo),
    }
}

const SalesRangeSelector = (props: SalesRangeSelectorProps) => {
    const { value, onChange } = props
    const enabled = !!value

    return (
        <Stack gap="xs" mt="md">
            <Text size="sm" fw={500}>
                Rango de fechas
            </Text>
            <Group align="flex-start" gap="sm" wrap="nowrap">
                <Checkbox
                    mt={8}
                    checked={enabled}
                    onChange={(event) =>
                        onChange(
                            event.currentTarget.checked
                                ? (value ?? getDefaultRange())
                                : null
                        )
                    }
                />
                <Group grow flex={1} gap="sm">
                    <InputDate
                        label="Fecha inicio"
                        value={value?.dateFrom ?? null}
                        onChange={(dateFrom) =>
                            onChange({
                                ...(value ?? getDefaultRange()),
                                dateFrom:
                                    dateFrom ?? getDefaultRange().dateFrom,
                            })
                        }
                        disabled={!enabled}
                    />
                    <InputDate
                        label="Fecha fin"
                        value={value?.dateTo ?? null}
                        onChange={(dateTo) =>
                            onChange({
                                ...(value ?? getDefaultRange()),
                                dateTo: dateTo ?? getDefaultRange().dateTo,
                            })
                        }
                        disabled={!enabled}
                    />
                </Group>
            </Group>
        </Stack>
    )
}

export default SalesRangeSelector
