import React from 'react'
import { SimpleGrid } from '@mantine/core'

import Constant from '@/utils/validation/Constant'
import Math from '@/utils/math/Math'

import CustomSparkline from '@/components/Stats/CustomSparkline'

import StatsSummary from '@/entities/stats/StatsSummary'
import StatsTimelinePoint from '@/entities/stats/StatsTimelinePoint'

interface StatsSummaryTilesProps {
    summary: StatsSummary
    timeline: StatsTimelinePoint[]
    groupingText: string // Text of the time bucket size
}

// Headline values of the period, each with its trend
const StatsSummaryTiles = (props: StatsSummaryTilesProps) => {
    const { summary, timeline, groupingText } = props

    return (
        <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
            <CustomSparkline
                title="Total vendido"
                description={`Suma del total de las ventas del período. La línea muestra el total de cada ${groupingText}`}
                value={Math.formatMoney(summary.totalSold)}
                data={timeline.map((point) => point.totalSold)}
            />
            <CustomSparkline
                title="Cantidad de ventas"
                description={`Cantidad de ventas realizadas en el período. La línea muestra la cantidad de cada ${groupingText}`}
                value={summary.salesCount.toLocaleString(
                    Constant.LOCALE_STRING
                )}
                data={timeline.map((point) => point.salesCount)}
            />
            <CustomSparkline
                title="Venta promedio"
                description={`Total vendido dividido la cantidad de ventas del período. La línea muestra el promedio de cada ${groupingText}`}
                value={Math.formatMoney(summary.averageSale)}
                data={timeline.map((point) => point.averageSale)}
            />
        </SimpleGrid>
    )
}

export default StatsSummaryTiles
