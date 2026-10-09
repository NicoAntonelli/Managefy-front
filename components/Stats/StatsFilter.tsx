import React, { useState } from 'react'
import { Checkbox, SegmentedControl, Stack, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

import DateHelper from '@/utils/math/DateHelper'
import TextHelper from '@/utils/string/TextHelper'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import SalesRangeSelector from '@/components/Sales/SalesRangeSelector'

import SalesDateRange from '@/entities/helpTypes/SalesDateRange'
import StatsFilters from '@/entities/stats/StatsFilters'
import StatsPeriod from '@/entities/helpTypes/StatsPeriod'

interface StatsFilterProps {
    appliedFilters: StatsFilters
    onApply: (filters: StatsFilters) => void
    onClose: () => void
}

const periodOptions = TextHelper.statsPeriodsComplete.map((period) => ({
    value: period,
    label: TextHelper.getStatsPeriodText(period),
}))

const StatsFilter = (props: StatsFilterProps) => {
    const { appliedFilters, onApply, onClose } = props

    const [period, setPeriod] = useState<StatsPeriod | null>(
        appliedFilters.period
    )
    const [range, setRange] = useState<SalesDateRange>(appliedFilters.range)
    const [includeNonBusinessDays, setIncludeNonBusinessDays] = useState(
        appliedFilters.includeNonBusinessDays
    )
    const [rangeError, setRangeError] = useState('')

    // The period buttons are a shortcut to fill the range
    const handlePeriodChange = (value: string) => {
        const newPeriod = value as StatsPeriod

        setPeriod(newPeriod)
        setRange(DateHelper.getPeriodRange(newPeriod))
        setRangeError('')
    }

    // A manual change of the range makes it a custom range
    const handleRangeChange = (newRange: SalesDateRange | null) => {
        if (!newRange) return

        setPeriod(null)
        setRange(newRange)
        setRangeError('')
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        if (range.dateFrom > range.dateTo) {
            setRangeError(
                'La fecha de inicio no puede ser mayor que la fecha de fin'
            )
            return
        }

        onApply({ period, range, includeNonBusinessDays })
        onClose()
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="1rem">
                <Stack gap="xs" mt="md">
                    <Text size="sm" fw={500}>
                        Período
                    </Text>
                    <SegmentedControl
                        fullWidth
                        size="xs"
                        data={periodOptions}
                        value={period ?? ''} // No option is highlighted for a custom range
                        onChange={handlePeriodChange}
                    />
                </Stack>
                <SalesRangeSelector
                    value={range}
                    error={rangeError}
                    alwaysEnabled
                    onChange={handleRangeChange}
                />
                <Stack gap="xs" mt="md">
                    <Text size="sm" fw={500}>
                        Días no hábiles
                    </Text>
                    <Checkbox
                        checked={includeNonBusinessDays}
                        label="Incluir las ventas de días no hábiles del emprendimiento"
                        onChange={(event) =>
                            setIncludeNonBusinessDays(
                                event.currentTarget.checked
                            )
                        }
                    />
                </Stack>
            </Stack>
            <ButtonsSubmitAndCancel
                operation="Create"
                operationText="Aceptar"
                leftIcon={<IconCheck />}
                submitting={false}
                onCancel={onClose}
            />
        </form>
    )
}

export default StatsFilter
