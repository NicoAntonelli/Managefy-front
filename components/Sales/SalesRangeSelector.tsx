import React from 'react'
import { Checkbox, Group, Stack, Text } from '@mantine/core'

import DateHelper from '@/utils/math/DateHelper'
import InputDate from '@/components/Common/Inputs/InputDate'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

interface SalesRangeSelectorProps {
    value: SalesDateRange | null
    onChange: (range: SalesDateRange | null) => void
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
                                ? (value ?? DateHelper.getDefaultRange())
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
                                ...(value ?? DateHelper.getDefaultRange()),
                                dateFrom:
                                    dateFrom ??
                                    DateHelper.getDefaultRange().dateFrom,
                            })
                        }
                        disabled={!enabled}
                    />
                    <InputDate
                        label="Fecha fin"
                        value={value?.dateTo ?? null}
                        onChange={(dateTo) =>
                            onChange({
                                ...(value ?? DateHelper.getDefaultRange()),
                                dateTo:
                                    dateTo ??
                                    DateHelper.getDefaultRange().dateTo,
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
