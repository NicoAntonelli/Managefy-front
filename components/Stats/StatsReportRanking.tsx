import React from 'react'
import { Stack, Table, Text } from '@mantine/core'

import StatsDataPoint from '@/entities/stats/StatsDataPoint'

interface StatsReportRankingProps {
    title: string
    valueLabel: string // Header of the value column
    data: StatsDataPoint[]
    textColor: string
    valueFormatter: (value: number) => string
}

// Ranking table for the printable statistics report
const StatsReportRanking = (props: StatsReportRankingProps) => {
    const { title, valueLabel, data, textColor, valueFormatter } = props

    return (
        <Stack gap="xs">
            <Text fw={700} c={textColor}>
                {title}
            </Text>
            {data.length === 0 ? (
                <Text size="sm" c={textColor}>
                    Sin datos para el período
                </Text>
            ) : (
                <Table withTableBorder withColumnBorders c={textColor}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={40}>#</Table.Th>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th ta="right">{valueLabel}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.map((item, index) => (
                            <Table.Tr key={`${item.label}-${index}`}>
                                <Table.Td>{index + 1}</Table.Td>
                                <Table.Td>{item.label}</Table.Td>
                                <Table.Td ta="right">
                                    {valueFormatter(item.value)}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Stack>
    )
}

export default StatsReportRanking
