import React from 'react'
import { Checkbox, Group, Stack, Text } from '@mantine/core'

import Theme from '@/app/theme'

import DateHelper from '@/utils/math/DateHelper'
import InputDate from '@/components/Common/Inputs/InputDate'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

interface SalesRangeSelectorProps {
    value: SalesDateRange | null
    error?: string
    alwaysEnabled?: boolean // Hides the checkbox, for places where the range is mandatory
    onChange: (range: SalesDateRange | null) => void
}

const SalesRangeSelector = (props: SalesRangeSelectorProps) => {
    const { value, error, alwaysEnabled, onChange } = props
    const enabled = alwaysEnabled || !!value

    return (
        <Stack gap="xs" mt="md">
            <Text size="sm" fw={500}>
                Rango de fechas
            </Text>
            <Group align="flex-start" gap="sm" wrap="nowrap">
                {!alwaysEnabled && (
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
                )}
                <Stack flex={1} gap={4}>
                    <Group grow gap="sm">
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
                            error={!!error}
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
                            error={!!error}
                        />
                    </Group>
                    {error && (
                        <Text size="xs" c={Theme.other!.danger}>
                            {error}
                        </Text>
                    )}
                </Stack>
            </Group>
        </Stack>
    )
}

export default SalesRangeSelector
