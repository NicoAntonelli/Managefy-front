// Aggregated sales values for one time bucket (day, week or month)
interface StatsTimelinePoint {
    label: string
    totalSold: number
    salesCount: number
    averageSale: number
    unitsSold: number
    profit: number
}

export default StatsTimelinePoint
