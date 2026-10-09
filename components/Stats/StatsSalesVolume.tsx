import React from 'react'

import Math from '@/utils/math/Math'

import CustomLineChart from '@/components/Stats/CustomLineChart'

import StatsTimelinePoint from '@/entities/stats/StatsTimelinePoint'

interface StatsSalesVolumeProps {
    timeline: StatsTimelinePoint[]
    groupingText: string // Text of the time bucket size
}

// Evolution of the units sold in the period
const StatsSalesVolume = (props: StatsSalesVolumeProps) => {
    const { timeline, groupingText } = props

    return (
        <CustomLineChart
            title="Evolución de unidades vendidas"
            description={`Unidades vendidas en cada ${groupingText} del período`}
            data={timeline.map((point) => ({
                label: point.label,
                value: point.unitsSold,
            }))}
            valueLabel="Unidades vendidas"
            valueFormatter={Math.formatUnits}
        />
    )
}

export default StatsSalesVolume
