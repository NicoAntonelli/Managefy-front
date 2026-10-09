import { useEffect, useMemo, useState } from 'react'

import Businesses from '@/services/businesses'
import Helper from '@/services/helper'
import Sales from '@/services/sales'

import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'

import Business from '@/entities/businesses/Business'
import Sale from '@/entities/sales/Sale'
import StatsFilters from '@/entities/stats/StatsFilters'

// Get the sales of a business in the filters range, and the statistics calculated from them
// The fetch is skipped while businessID is undefined or the hook isn't enabled
const useGetStatsData = (
    businessID: number | undefined,
    filters: StatsFilters,
    enabled: boolean = true
) => {
    const [sales, setSales] = useState<Sale[]>([])
    const [business, setBusiness] = useState<Business | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const { dateFrom, dateTo } = filters.range

    useEffect(() => {
        if (!enabled || !businessID) {
            setLoading(false)
            return
        }

        let active = true
        setLoading(true)

        const fetchData = async () => {
            try {
                const response = await Sales.listSalesByInterval(
                    businessID,
                    dateFrom,
                    dateTo
                )
                if (!active) return

                setSales(response || [])
                setError(false)
            } catch (error) {
                if (!active) return

                setSales([])
                setError(true)
            }

            // The business is only needed for its business days, so the statistics work without it
            try {
                const response = await Businesses.getOneBusiness(businessID)
                if (active) setBusiness(response)
            } catch (error) {
                Helper.parseLogError(error)
                if (active) setBusiness(null)
            } finally {
                if (active) setLoading(false)
            }
        }
        fetchData()

        return () => {
            active = false
        }
    }, [enabled, businessID, dateFrom, dateTo])

    const statsSales = useMemo(
        () =>
            Math.filterSalesForStats(
                sales,
                filters.includeNonBusinessDays,
                business?.businessDays
            ),
        [sales, filters.includeNonBusinessDays, business]
    )

    const summary = useMemo(
        () => Math.getSalesSummary(statsSales),
        [statsSales]
    )

    const timeline = useMemo(
        () =>
            Math.getSalesTimeline(
                statsSales,
                filters.range,
                filters.includeNonBusinessDays,
                business?.businessDays
            ),
        [statsSales, filters.range, filters.includeNonBusinessDays, business]
    )

    const grouping = DateHelper.getStatsGrouping(filters.range)

    return {
        business,
        statsSales,
        summary,
        timeline,
        grouping,
        loading,
        error,
    }
}

export default useGetStatsData
