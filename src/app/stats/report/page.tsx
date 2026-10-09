'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import TextHelper from '@/utils/string/TextHelper'

import SplashLogo from '@/components/Common/Loader/SplashLogo'
import StatsReport from '@/components/Stats/StatsReport'

import StatsPeriod from '@/entities/helpTypes/StatsPeriod'

const StatsReportPageContent = () => {
    const searchParams = useSearchParams()

    const businessID = Number(searchParams.get('businessID'))
    const dateFrom = searchParams.get('from') ?? ''
    const dateTo = searchParams.get('to') ?? ''
    const includeNonBusinessDays =
        searchParams.get('includeNonBusinessDays') !== 'false'

    // Only known periods are accepted, any other value is a custom range
    const periodParam = searchParams.get('period') as StatsPeriod | null
    const period =
        periodParam && TextHelper.statsPeriodsComplete.includes(periodParam)
            ? periodParam
            : null

    return (
        <StatsReport
            businessID={businessID}
            filters={{
                period,
                range: { dateFrom, dateTo },
                includeNonBusinessDays,
            }}
        />
    )
}

const StatsReportPage = () => {
    return (
        <Suspense fallback={<SplashLogo />}>
            <StatsReportPageContent />
        </Suspense>
    )
}

export default StatsReportPage
