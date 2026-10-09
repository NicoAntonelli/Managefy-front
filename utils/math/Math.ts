//////////// MATH-RELATED TOOLS ////////////

import Constant from '@/utils/validation/Constant'
import DateHelper from '@/utils/math/DateHelper'

import Sale from '@/entities/sales/Sale'
import SaleLine from '@/entities/sales/SaleLine'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'
import StatsDataPoint from '@/entities/stats/StatsDataPoint'
import StatsSummary from '@/entities/stats/StatsSummary'
import StatsTimelinePoint from '@/entities/stats/StatsTimelinePoint'
import WeekDay from '@/entities/helpTypes/WeekDay'

//////////// Simple calculations for sales ////////////

// Calculate subtotal considering price, amount, and an optional discount or surcharge factor
const calculateSubtotal = (
    price: number,
    amount: number,
    discountSurcharge?: number
): number => {
    if (price === null || price === undefined) {
        throw new Error('Cannot calculate subtotal with an empty price')
    }

    if (amount === null || amount === undefined) {
        throw new Error('Cannot calculate subtotal with an empty amount')
    }

    // if discountSurcharge is not provided or its zero, defaults to 1
    const factor = discountSurcharge || 1

    return price * amount * factor
}

// Format a factor as a percentage. Can be negative
const formatFactorToPercentage = (factor: number): number => {
    if (factor === null || factor === undefined) {
        throw new Error('Cannot format an empty factor')
    }

    return (factor - 1) * 100
}

// Format a factor as a percentage with two decimal places and "%" symbol. Can be negative
const formatFactorToPercentageString = (factor: number): string => {
    const decimal = formatFactorToPercentage(factor)

    return `${decimal.toFixed(2)}%`
}

// Format a number as a monetary value with two decimal places and "$" sign
const formatMoney = (amount: number): string => {
    if (amount === null || amount === undefined) {
        throw new Error('Cannot format an empty amount')
    }

    return `$${amount.toFixed(2)}`
}

// Format a percentage as a factor. Always positive
const formatPercentageToFactor = (percentage: number): number => {
    if (percentage === null || percentage === undefined) {
        throw new Error('Cannot format an empty percentage')
    }

    return 1 + percentage * 0.01
}

//////////// Statistics ////////////

// Net profit of a sale line: subtotal (with discount or surcharge) minus the total cost
const calculateSaleLineProfit = (saleLine: SaleLine): number => {
    const subtotal = calculateSubtotal(
        saleLine.price,
        saleLine.amount,
        saleLine.discountSurcharge ?? undefined
    )

    return subtotal - saleLine.cost * saleLine.amount
}

// Net profit of a whole sale
const calculateSaleProfit = (sale: Sale): number => {
    return (sale.saleLines ?? []).reduce(
        (total, saleLine) => total + calculateSaleLineProfit(saleLine),
        0
    )
}

// Units sold in a whole sale
const calculateSaleUnits = (sale: Sale): number => {
    return (sale.saleLines ?? []).reduce(
        (total, saleLine) => total + saleLine.amount,
        0
    )
}

// Sales considered for statistics: cancelled ones are always excluded,
// and the ones made on non-business days are excluded if requested
const filterSalesForStats = (
    sales: Sale[],
    includeNonBusinessDays: boolean,
    businessDays?: Record<WeekDay, boolean> | null
): Sale[] => {
    return sales.filter((sale) => {
        if (sale.state === 'Cancelled') return false
        if (includeNonBusinessDays || !businessDays) return true

        return DateHelper.isBusinessDay(new Date(sale.date), businessDays)
    })
}

// Sums values by key and returns the highest ones, in descending order
const getTopItems = (
    entries: { key: string | number; label: string; value: number }[],
    limit: number = Constant.STATS_TOP_ITEMS
): StatsDataPoint[] => {
    const totals = new Map<string | number, StatsDataPoint>()

    entries.forEach(({ key, label, value }) => {
        const current = totals.get(key)
        totals.set(key, { label, value: (current?.value ?? 0) + value })
    })

    return Array.from(totals.values())
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, limit)
}

// Products with the most units sold
const getTopProductsByUnits = (sales: Sale[]): StatsDataPoint[] => {
    return getTopItems(
        sales.flatMap((sale) =>
            (sale.saleLines ?? []).map((saleLine) => ({
                key: saleLine.product.id,
                label: saleLine.product.name,
                value: saleLine.amount,
            }))
        )
    )
}

// Products with the highest net profit
const getTopProductsByProfit = (sales: Sale[]): StatsDataPoint[] => {
    return getTopItems(
        sales.flatMap((sale) =>
            (sale.saleLines ?? []).map((saleLine) => ({
                key: saleLine.product.id,
                label: saleLine.product.name,
                value: calculateSaleLineProfit(saleLine),
            }))
        )
    )
}

// Clients with the highest total bought (sales without client are skipped)
const getTopClientsByTotal = (sales: Sale[]): StatsDataPoint[] => {
    return getTopItems(
        sales
            .filter((sale) => sale.client?.id)
            .map((sale) => ({
                key: sale.client!.id!,
                label: sale.client!.name,
                value: sale.totalPrice,
            }))
    )
}

// Suppliers whose products generated the highest net profit (products without supplier are skipped)
const getTopSuppliersByProfit = (sales: Sale[]): StatsDataPoint[] => {
    return getTopItems(
        sales.flatMap((sale) =>
            (sale.saleLines ?? [])
                .filter((saleLine) => saleLine.product.supplier?.id)
                .map((saleLine) => ({
                    key: saleLine.product.supplier!.id,
                    label: saleLine.product.supplier!.name,
                    value: calculateSaleLineProfit(saleLine),
                }))
        )
    )
}

// Totals of the whole period
const getSalesSummary = (sales: Sale[]): StatsSummary => {
    const totalSold = sales.reduce((total, sale) => total + sale.totalPrice, 0)
    const salesCount = sales.length

    return {
        totalSold,
        salesCount,
        averageSale: salesCount ? totalSold / salesCount : 0,
        unitsSold: sales.reduce(
            (total, sale) => total + calculateSaleUnits(sale),
            0
        ),
        profit: sales.reduce(
            (total, sale) => total + calculateSaleProfit(sale),
            0
        ),
    }
}

// Totals per time bucket (day, week or month, depending on the range length)
// Buckets without sales are included with zero values, so the timelines are continuous
const getSalesTimeline = (
    sales: Sale[],
    range: SalesDateRange,
    includeNonBusinessDays: boolean,
    businessDays?: Record<WeekDay, boolean> | null
): StatsTimelinePoint[] => {
    const grouping = DateHelper.getStatsGrouping(range)
    const buckets = DateHelper.getRangeBuckets(
        range,
        grouping,
        includeNonBusinessDays ? null : businessDays
    )

    const timeline = new Map<string, StatsTimelinePoint>(
        buckets.map(({ key, label }) => [
            key,
            {
                label,
                totalSold: 0,
                salesCount: 0,
                averageSale: 0,
                unitsSold: 0,
                profit: 0,
            },
        ])
    )

    sales.forEach((sale) => {
        const point = timeline.get(
            DateHelper.getBucketKey(new Date(sale.date), grouping)
        )
        if (!point) return

        point.totalSold += sale.totalPrice
        point.salesCount += 1
        point.unitsSold += calculateSaleUnits(sale)
        point.profit += calculateSaleProfit(sale)
    })

    return Array.from(timeline.values()).map((point) => ({
        ...point,
        averageSale: point.salesCount ? point.totalSold / point.salesCount : 0,
    }))
}

// Format a number of units with thousands separator
const formatUnits = (amount: number): string => {
    return `${amount.toLocaleString(Constant.LOCALE_STRING)} u.`
}

const Math = {
    calculateSaleLineProfit,
    calculateSaleProfit,
    calculateSaleUnits,
    calculateSubtotal,
    filterSalesForStats,
    formatUnits,
    getSalesSummary,
    getSalesTimeline,
    getTopClientsByTotal,
    getTopProductsByProfit,
    getTopProductsByUnits,
    getTopSuppliersByProfit,
    formatMoney,
    formatFactorToPercentage,
    formatFactorToPercentageString,
    formatPercentageToFactor,
}

export default Math
