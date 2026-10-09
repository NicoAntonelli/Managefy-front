import React from 'react'
import { LineChart } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

import Theme from '@/app/theme'

import StatsCardTitle from '@/components/Stats/StatsCardTitle'

import StatsDataPoint from '@/entities/stats/StatsDataPoint'

interface CustomLineChartProps {
    title: string
    description: string // What the chart measures, shown in a tooltip next to the title
    data: StatsDataPoint[]
    valueLabel: string // Name of the measure, shown in the tooltip of each point
    valueFormatter: (value: number) => string
}

// Above this amount of points, the dots make the line too noisy
const maxPointsWithDots = 31

// Line chart, meant for the evolution of a value over time
const CustomLineChart = (props: CustomLineChartProps) => {
    const { title, description, data, valueLabel, valueFormatter } = props

    return (
        <Card withBorder padding="lg" radius="md">
            <StatsCardTitle title={title} description={description} />
            {data.length === 0 ? (
                <Text c="dimmed" size="sm" py="xl" ta="center">
                    Sin datos para el período seleccionado
                </Text>
            ) : (
                <LineChart
                    mt="md"
                    h={260}
                    data={data as unknown as Record<string, unknown>[]}
                    dataKey="label"
                    series={[
                        {
                            name: 'value',
                            label: valueLabel,
                            color: `${Theme.primaryColor}.6`,
                        },
                    ]}
                    valueFormatter={valueFormatter}
                    curveType="monotone"
                    withDots={data.length <= maxPointsWithDots}
                    gridAxis="y"
                    yAxisProps={{ width: 80 }}
                />
            )}
        </Card>
    )
}

export default CustomLineChart
