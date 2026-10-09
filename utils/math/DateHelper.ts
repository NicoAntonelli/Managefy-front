//////////// DATE-RELATED TOOLS ////////////

import Constant from '@/utils/validation/Constant'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'
import StatsGrouping from '@/entities/helpTypes/StatsGrouping'
import StatsPeriod from '@/entities/helpTypes/StatsPeriod'
import WeekDay from '@/entities/helpTypes/WeekDay'

//////////// More small constants ////////////

// Max days of a range to group the statistics by day or by week
// Surpassing "maxDaysGroupedByWeek", the grouping will switch to month
const maxDaysGroupedByDay = 62 // 2 months
const maxDaysGroupedByWeek = 190 // 6 months + margin

// A day has 86.400.000 ms
const millisecondsInADay = 24 * 60 * 60 * 1000

//////////// Tools ////////////

// Week days in the same order as Date.getDay() (0 = Sunday)
const weekDaysByIndex: WeekDay[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

// Months covered by each statistics period (the week period is handled apart)
const statsPeriodMonths: Record<Exclude<StatsPeriod, 'Week'>, number> = {
    Month: 1,
    ThreeMonths: 3,
    SixMonths: 6,
    TwelveMonths: 12,
}

// Formats the date both for Date objects and date strings
const formatDateTime = (date: Date | string, isFileName?: boolean): string => {
    if (!date) {
        throw new Error('Cannot format an empty date')
    }

    const parsedDate = new Date(date)

    // Format output for file names: yyyy-MM-dd HH-mm-ss
    if (isFileName) {
        const year = parsedDate.getFullYear()
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
        const day = String(parsedDate.getDate()).padStart(2, '0')
        const hours = String(parsedDate.getHours()).padStart(2, '0')
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
        const seconds = String(parsedDate.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
    }

    // Format output default: dd/MM/yyyy HH:mm
    return parsedDate
        .toLocaleString(Constant.LOCALE_STRING, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(',', '')
}

// Formats a date for use in HTML date input fields (YYYY-MM-DD)
const getDateInputValue = (date: Date, addOneDay?: boolean): string => {
    // Adding the day through the Date avoids invalid values like the 32nd
    const value = addOneDay
        ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        : date

    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// Parses a date input value (YYYY-MM-DD) as a local date at 00:00
const parseDateInputValue = (value: string): Date => {
    const [year, month, day] = value.split('-').map(Number)

    return new Date(year, month - 1, day)
}

// Formats a date input value (YYYY-MM-DD) as dd/MM/yyyy
const formatDateInputValue = (value: string): string => {
    const [year, month, day] = value.split('-')

    return `${day}/${month}/${year}`
}

// Gets the date range of a statistics period, ending tomorrow like the default range
const getPeriodRange = (period: StatsPeriod): SalesDateRange => {
    const dateFrom = today()

    if (period === 'Week') dateFrom.setDate(dateFrom.getDate() - 7)
    else dateFrom.setMonth(dateFrom.getMonth() - statsPeriodMonths[period])

    return {
        dateFrom: getDateInputValue(dateFrom),
        dateTo: getDateInputValue(today(), true),
    }
}

// Gets the statistics period that matches the default range, if any
const getDefaultPeriod = (): StatsPeriod | null => {
    const period = (
        Object.keys(statsPeriodMonths) as Exclude<StatsPeriod, 'Week'>[]
    ).find(
        (period) =>
            statsPeriodMonths[period] === Constant.DEFAULT_INTERVAL_MONTHS
    )

    return period ?? null
}

// Checks if a date is one of the business days
const isBusinessDay = (
    date: Date,
    businessDays: Record<WeekDay, boolean>
): boolean => {
    return !!businessDays[weekDaysByIndex[date.getDay()]]
}

// Chooses the time bucket size so the timelines don't get too crowded
const getStatsGrouping = (range: SalesDateRange): StatsGrouping => {
    const dateFrom = parseDateInputValue(range.dateFrom)
    const dateTo = parseDateInputValue(range.dateTo)
    const days = (dateTo.getTime() - dateFrom.getTime()) / millisecondsInADay

    if (days <= maxDaysGroupedByDay) return 'Day'
    if (days <= maxDaysGroupedByWeek) return 'Week'
    return 'Month'
}

// Gets the first day of the time bucket that contains the date (weeks start on Monday)
const getBucketStart = (date: Date, grouping: StatsGrouping): Date => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    switch (grouping) {
        case 'Week':
            return new Date(year, month, day - ((date.getDay() + 6) % 7))
        case 'Month':
            return new Date(year, month, 1)
        default:
            return new Date(year, month, day)
    }
}

// Unique key of the time bucket that contains the date
const getBucketKey = (date: Date, grouping: StatsGrouping): string => {
    return getDateInputValue(getBucketStart(date, grouping))
}

// Readable label of a time bucket: dd/MM for days and weeks, short month and year for months
const getBucketLabel = (bucketStart: Date, grouping: StatsGrouping): string => {
    if (grouping === 'Month') {
        return bucketStart.toLocaleDateString(Constant.LOCALE_STRING, {
            month: 'short',
            year: '2-digit',
        })
    }

    return bucketStart.toLocaleDateString(Constant.LOCALE_STRING, {
        day: '2-digit',
        month: '2-digit',
    })
}

// Ordered time buckets of a range, until today at most
// Daily buckets skip the non-business days when businessDays is provided
const getRangeBuckets = (
    range: SalesDateRange,
    grouping: StatsGrouping,
    businessDays?: Record<WeekDay, boolean> | null
): { key: string; label: string }[] => {
    const buckets: { key: string; label: string }[] = []

    const dateFrom = parseDateInputValue(range.dateFrom)
    const todayDate = parseDateInputValue(getDateInputValue(today()))
    const rangeEnd = parseDateInputValue(range.dateTo)
    const dateTo = rangeEnd < todayDate ? rangeEnd : todayDate

    for (
        let date = new Date(dateFrom);
        date <= dateTo;
        date.setDate(date.getDate() + 1)
    ) {
        if (
            grouping === 'Day' &&
            businessDays &&
            !isBusinessDay(date, businessDays)
        ) {
            continue
        }

        const key = getBucketKey(date, grouping)
        if (buckets[buckets.length - 1]?.key === key) continue

        buckets.push({
            key,
            label: getBucketLabel(getBucketStart(date, grouping), grouping),
        })
    }

    return buckets
}

// Gets the default date range for sales filtering based on the constant interval
const getDefaultRange = (): SalesDateRange => {
    const dateTo = today()
    const dateFrom = today()
    dateFrom.setMonth(dateFrom.getMonth() - Constant.DEFAULT_INTERVAL_MONTHS)

    return {
        dateFrom: getDateInputValue(dateFrom),
        dateTo: getDateInputValue(dateTo, true),
    }
}

// Today's date
const today = (): Date => new Date()

// Tomorrow's date
const tomorrow = (): Date => {
    const todayDate = today()
    return new Date(todayDate.setDate(todayDate.getDate() + 1))
}

const DateHelper = {
    formatDateInputValue,
    formatDateTime,
    getBucketKey,
    getDateInputValue,
    getDefaultPeriod,
    getDefaultRange,
    getPeriodRange,
    getRangeBuckets,
    getStatsGrouping,
    isBusinessDay,
    parseDateInputValue,
    today,
    tomorrow,
}

export default DateHelper
