import SalesDateRange from '@/entities/helpTypes/SalesDateRange'
import StatsPeriod from '@/entities/helpTypes/StatsPeriod'

interface StatsFilters {
    // Null when the user chose a custom range
    period: StatsPeriod | null
    range: SalesDateRange
    includeNonBusinessDays: boolean
}

export default StatsFilters
