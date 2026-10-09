import React, { useMemo } from 'react'

import Constant from '@/utils/validation/Constant'
import Math from '@/utils/math/Math'

import CustomBarChart from '@/components/Stats/CustomBarChart'

import Sale from '@/entities/sales/Sale'

interface StatsProductsProfitProps {
    sales: Sale[]
}

// Products with the highest net profit in the period
const StatsProductsProfit = (props: StatsProductsProfitProps) => {
    const { sales } = props

    const data = useMemo(() => Math.getTopProductsByProfit(sales), [sales])

    return (
        <CustomBarChart
            title="Productos con mayor ganancia"
            description={`Los ${Constant.STATS_TOP_ITEMS} productos con mayor ganancia neta (precio de venta menos costo) en el período`}
            data={data}
            valueLabel="Ganancia neta"
            valueFormatter={Math.formatMoney}
        />
    )
}

export default StatsProductsProfit
