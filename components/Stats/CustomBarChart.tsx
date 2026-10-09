import React from 'react'
import { BarChart } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

import Theme from '@/app/theme'

import StatsCardTitle from '@/components/Stats/StatsCardTitle'

import StatsDataPoint from '@/entities/stats/StatsDataPoint'

interface CustomBarChartProps {
    title: string
    description: string // What the chart measures, shown in a tooltip next to the title
    data: StatsDataPoint[]
    valueLabel: string // Name of the measure, shown in the tooltip of each bar
    valueFormatter: (value: number) => string
}

// Space for each bar and for the axis
const barHeight = 36
const axisHeight = 40
const maxLabelLength = 20

const truncateLabel = (label: string) =>
    label.length > maxLabelLength
        ? `${label.slice(0, maxLabelLength - 1)}…`
        : label

// Horizontal bar chart, meant for rankings
const CustomBarChart = (props: CustomBarChartProps) => {
    const { title, description, data, valueLabel, valueFormatter } = props

    return (
        <Card withBorder padding="lg" radius="md">
            <StatsCardTitle title={title} description={description} />
            {data.length === 0 ? (
                <Text c="dimmed" size="sm" py="xl" ta="center">
                    Sin datos para el período seleccionado
                </Text>
            ) : (
                <BarChart
                    mt="md"
                    h={data.length * barHeight + axisHeight}
                    data={data as unknown as Record<string, unknown>[]}
                    dataKey="label"
                    orientation="vertical"
                    series={[
                        {
                            name: 'value',
                            label: valueLabel,
                            color: `${Theme.primaryColor}.6`,
                        },
                    ]}
                    valueFormatter={valueFormatter}
                    gridAxis="x"
                    maxBarWidth={20}
                    barProps={{ radius: [0, 4, 4, 0] }}
                    yAxisProps={{ width: 140, tickFormatter: truncateLabel }}
                />
            )}
        </Card>
    )
}

export default CustomBarChart
