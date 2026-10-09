import React from 'react'
import { Sparkline } from '@mantine/charts'
import { Card, Text } from '@mantine/core'

import Theme from '@/app/theme'

import StatsCardTitle from '@/components/Stats/StatsCardTitle'

interface CustomSparklineProps {
    title: string
    description: string // What the value measures, shown in a tooltip next to the title
    value: string // Already formatted value for the whole period
    data: number[] // Evolution of the value over the period
}

// Stat tile: a headline value with a small trend line below
const CustomSparkline = (props: CustomSparklineProps) => {
    const { title, description, value, data } = props

    return (
        <Card withBorder padding="lg" radius="md">
            <StatsCardTitle title={title} description={description} dimmed />
            <Text fw={700} size="1.6rem" mt={4}>
                {value}
            </Text>
            {data.length > 1 && (
                <Sparkline
                    mt="sm"
                    h={48}
                    data={data}
                    curveType="monotone"
                    color={`${Theme.primaryColor}.6`}
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
            )}
        </Card>
    )
}

export default CustomSparkline
