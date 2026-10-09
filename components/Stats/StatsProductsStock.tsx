import React, { useMemo } from 'react'

import Constant from '@/utils/validation/Constant'
import Math from '@/utils/math/Math'

import CustomBarChart from '@/components/Stats/CustomBarChart'

import Sale from '@/entities/sales/Sale'

interface StatsProductsStockProps {
    sales: Sale[]
}

// Products with the most units sold in the period
const StatsProductsStock = (props: StatsProductsStockProps) => {
    const { sales } = props

    const data = useMemo(() => Math.getTopProductsByUnits(sales), [sales])

    return (
        <CustomBarChart
            title="Productos más vendidos"
            description={`Los ${Constant.STATS_TOP_ITEMS} productos con más unidades vendidas en el período`}
            data={data}
            valueLabel="Unidades vendidas"
            valueFormatter={Math.formatUnits}
        />
    )
}

export default StatsProductsStock
