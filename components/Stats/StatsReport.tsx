import React, { useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
    Button,
    Group,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
} from '@mantine/core'
import { IconPrinter } from '@tabler/icons-react'

import Theme from '@/app/theme'
import useGetStatsData from '@/hooks/stats/useGetStatsData'

import Constant from '@/utils/validation/Constant'
import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'
import TextHelper from '@/utils/string/TextHelper'

import ErrorAlert from '@/components/Common/Error/ErrorAlert'
import SplashLogo from '@/components/Common/Loader/SplashLogo'
import StatsReportRanking from '@/components/Stats/StatsReportRanking'

import StatsFilters from '@/entities/stats/StatsFilters'

interface StatsReportProps {
    businessID: number
    filters: StatsFilters
}

const StatsReport = (props: StatsReportProps) => {
    const { businessID, filters } = props

    const { business, statsSales, summary, loading, error } = useGetStatsData(
        businessID,
        filters
    )

    const topProductsByUnits = useMemo(
        () => Math.getTopProductsByUnits(statsSales),
        [statsSales]
    )
    const topProductsByProfit = useMemo(
        () => Math.getTopProductsByProfit(statsSales),
        [statsSales]
    )
    const topClients = useMemo(
        () => Math.getTopClientsByTotal(statsSales),
        [statsSales]
    )
    const topSuppliers = useMemo(
        () => Math.getTopSuppliersByProfit(statsSales),
        [statsSales]
    )

    const title = TextHelper.getStatsTitle(filters.period, filters.range)

    useEffect(() => {
        if (loading) return

        const dateTime = DateHelper.formatDateTime(DateHelper.today(), true)
        const previousTitle = document.title
        document.title = `Managefy - Reporte de estadísticas - ${dateTime}`

        return () => {
            document.title = previousTitle
        }
    }, [loading])

    if (loading) return <SplashLogo />

    if (error) {
        return (
            <ErrorAlert message="No se pudo cargar el reporte. Cerrá esta ventana para seguir navegando en Managefy." />
        )
    }

    const summaryRows = [
        { label: 'Total vendido', value: Math.formatMoney(summary.totalSold) },
        {
            label: 'Cantidad de ventas',
            value: summary.salesCount.toLocaleString(Constant.LOCALE_STRING),
        },
        {
            label: 'Venta promedio',
            value: Math.formatMoney(summary.averageSale),
        },
        {
            label: 'Unidades vendidas',
            value: Math.formatUnits(summary.unitsSold),
        },
        { label: 'Ganancia neta', value: Math.formatMoney(summary.profit) },
    ]

    return (
        <Stack
            className="min-h-screen bg-white p-8 print:p-0"
            align="center"
            gap="md">
            <Group
                justify="flex-end"
                w="100%"
                maw={900}
                className="print:hidden">
                <Button
                    color={Theme.primaryColor}
                    leftSection={<IconPrinter size={18} />}
                    onClick={() => window.print()}>
                    Imprimir
                </Button>
            </Group>

            <Stack
                w="100%"
                maw={900}
                gap="lg"
                p="xl"
                style={{
                    backgroundColor: Theme.other!.printBackground,
                    color: Theme.other!.printText,
                    border: `1px solid ${Theme.other!.printText}`,
                }}>
                <Group align="flex-start" wrap="nowrap" gap="md">
                    <Image
                        src="/Managefy-logo.jpeg"
                        alt="Managefy"
                        width={72}
                        height={72}
                        style={{ height: 72, width: 'auto' }}
                    />
                    <Stack gap={2}>
                        <Text fw={700} size="lg" c={Theme.other!.printText}>
                            {business?.name || 'Sin asignar'}
                        </Text>
                        <Title
                            order={2}
                            size="1.3rem"
                            c={Theme.other!.printText}>
                            {title}
                        </Title>
                        <Text size="sm" c={Theme.other!.printText}>
                            {!filters.includeNonBusinessDays &&
                                'Sin incluir las ventas de días no hábiles. '}
                            Generado el{' '}
                            {DateHelper.formatDateTime(DateHelper.today())}
                        </Text>
                    </Stack>
                </Group>

                <Stack gap="xs">
                    <Text fw={700} c={Theme.other!.printText}>
                        Resumen
                    </Text>
                    <Table
                        withTableBorder
                        withColumnBorders
                        c={Theme.other!.printText}>
                        <Table.Tbody>
                            {summaryRows.map((row) => (
                                <Table.Tr key={row.label}>
                                    <Table.Td fw={500}>{row.label}</Table.Td>
                                    <Table.Td ta="right">{row.value}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Stack>

                <SimpleGrid cols={2} spacing="lg">
                    <StatsReportRanking
                        title="Productos más vendidos"
                        valueLabel="Unidades"
                        data={topProductsByUnits}
                        valueFormatter={Math.formatUnits}
                    />
                    <StatsReportRanking
                        title="Productos con mayor ganancia"
                        valueLabel="Ganancia neta"
                        data={topProductsByProfit}
                        valueFormatter={Math.formatMoney}
                    />
                    <StatsReportRanking
                        title="Mejores clientes"
                        valueLabel="Total comprado"
                        data={topClients}
                        valueFormatter={Math.formatMoney}
                    />
                    <StatsReportRanking
                        title="Proveedores con mayor ganancia"
                        valueLabel="Ganancia neta"
                        data={topSuppliers}
                        valueFormatter={Math.formatMoney}
                    />
                </SimpleGrid>
            </Stack>
        </Stack>
    )
}

export default StatsReport
