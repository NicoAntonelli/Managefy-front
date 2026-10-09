import React, { useState } from 'react'
import { Button, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconPrinter } from '@tabler/icons-react'

import Theme from '@/app/theme'
import useCheckUserLogin from '@/hooks/users/useCheckUserLogin'
import useGetStatsData from '@/hooks/stats/useGetStatsData'
import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'
import DateHelper from '@/utils/math/DateHelper'
import TextHelper from '@/utils/string/TextHelper'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import StatsClients from '@/components/Stats/StatsClients'
import StatsFilter from '@/components/Stats/StatsFilter'
import StatsProductsProfit from '@/components/Stats/StatsProductsProfit'
import StatsProductsStock from '@/components/Stats/StatsProductsStock'
import StatsSaleProfit from '@/components/Stats/StatsSaleProfit'
import StatsSalesVolume from '@/components/Stats/StatsSalesVolume'
import StatsSummaryTiles from '@/components/Stats/StatsSummaryTiles'
import StatsSuppliers from '@/components/Stats/StatsSuppliers'
import UserValidationContinue from '@/components/User/UserValidation/UserValidationContinue'

import StatsFilters from '@/entities/stats/StatsFilters'

// Default filters: last DEFAULT_INTERVAL_MONTHS months, including non-business days
const getDefaultFilters = (): StatsFilters => ({
    period: DateHelper.getDefaultPeriod(),
    range: DateHelper.getDefaultRange(),
    includeNonBusinessDays: true,
})

const StatsMain = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [filters, setFilters] = useState<StatsFilters>(getDefaultFilters)
    const [prevBusinessID, setPrevBusinessID] = useState(businessID)

    const checkUserLogin = useCheckUserLogin()

    if (businessID !== prevBusinessID) {
        setPrevBusinessID(businessID)
        setFilters(getDefaultFilters())
    }

    const { statsSales, summary, timeline, grouping, loading, error } =
        useGetStatsData(businessID, filters, !!checkUserLogin.isValidated)

    const groupingText = TextHelper.getStatsGroupingText(grouping)
    const title = TextHelper.getStatsTitle(filters.period, filters.range)

    // The report is opened in a new tab, ready to print
    const openReport = () => {
        if (!businessID) return

        const params = new URLSearchParams({
            businessID: String(businessID),
            from: filters.range.dateFrom,
            to: filters.range.dateTo,
            includeNonBusinessDays: String(filters.includeNonBusinessDays),
        })
        if (filters.period) params.set('period', filters.period)

        window.open(
            `/stats/report?${params.toString()}`,
            '_blank',
            'noopener,noreferrer'
        )
    }

    if (checkUserLogin.isValidated === null) {
        return <SkeletonFull />
    }

    if (!checkUserLogin.isValidated) {
        return <UserValidationContinue checkUserLogin={checkUserLogin} />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="estadísticas" />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar
                    business={selectedBusiness}
                    filterContent={({ onClose }) => (
                        <StatsFilter
                            key={`${selectedBusiness.id}-${filters.period ?? 'custom'}-${filters.range.dateFrom}-${filters.range.dateTo}-${filters.includeNonBusinessDays}`}
                            appliedFilters={filters}
                            onApply={setFilters}
                            onClose={onClose}
                        />
                    )}
                />
            </div>

            <Group justify="space-between" align="center" gap="md">
                <Stack gap={4}>
                    <Title size="1.8rem">{title}</Title>
                    {!filters.includeNonBusinessDays && (
                        <Text size="sm" c="dimmed">
                            Sin incluir las ventas de días no hábiles
                        </Text>
                    )}
                </Stack>
                <Button
                    color={Theme.primaryColor}
                    variant="light"
                    leftSection={<IconPrinter size={18} />}
                    disabled={loading || statsSales.length === 0}
                    onClick={openReport}>
                    Imprimir reporte
                </Button>
            </Group>

            {loading ? (
                <SkeletonFull />
            ) : error ? (
                <Text c="dimmed" ta="center" py="xl">
                    No se pudieron cargar las ventas del período. Inténtalo de
                    nuevo más tarde.
                </Text>
            ) : statsSales.length === 0 ? (
                <Stack align="center" gap="xs" py="xl">
                    <Title size="1.5rem">Sin ventas en el período</Title>
                    <Text ta="center" c="dimmed" maw={480}>
                        No hay ventas para calcular estadísticas. Probá con otro
                        rango de fechas desde el filtro.
                    </Text>
                </Stack>
            ) : (
                <Stack gap="lg">
                    <StatsSummaryTiles
                        summary={summary}
                        timeline={timeline}
                        groupingText={groupingText}
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        <StatsSalesVolume
                            timeline={timeline}
                            groupingText={groupingText}
                        />
                        <StatsSaleProfit
                            timeline={timeline}
                            groupingText={groupingText}
                        />
                        <StatsProductsStock sales={statsSales} />
                        <StatsProductsProfit sales={statsSales} />
                        <StatsClients sales={statsSales} />
                        <StatsSuppliers sales={statsSales} />
                    </SimpleGrid>
                </Stack>
            )}
        </Stack>
    )
}

export default StatsMain
