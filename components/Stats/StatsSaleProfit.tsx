import React from 'react'

import Math from '@/utils/math/Math'

import CustomLineChart from '@/components/Stats/CustomLineChart'

import StatsTimelinePoint from '@/entities/stats/StatsTimelinePoint'

interface StatsSaleProfitProps {
    timeline: StatsTimelinePoint[]
    groupingText: string // Text of the time bucket size
}

// Evolution of the net profit of the sales in the period
const StatsSaleProfit = (props: StatsSaleProfitProps) => {
    const { timeline, groupingText } = props

    return (
        <CustomLineChart
            title="Evolución de la ganancia"
            description={`Ganancia neta (precio de venta menos costo) de las ventas de cada ${groupingText} del período`}
            data={timeline.map((point) => ({
                label: point.label,
                value: point.profit,
            }))}
            valueLabel="Ganancia neta"
            valueFormatter={Math.formatMoney}
        />
    )
}

export default StatsSaleProfit
