import React, { useMemo } from 'react'

import Constant from '@/utils/validation/Constant'
import Math from '@/utils/math/Math'

import CustomBarChart from '@/components/Stats/CustomBarChart'

import Sale from '@/entities/sales/Sale'

interface StatsSuppliersProps {
    sales: Sale[]
}

// Suppliers whose products generated the highest net profit in the period
const StatsSuppliers = (props: StatsSuppliersProps) => {
    const { sales } = props

    const data = useMemo(() => Math.getTopSuppliersByProfit(sales), [sales])

    return (
        <CustomBarChart
            title="Proveedores con mayor ganancia"
            description={`Los ${Constant.STATS_TOP_ITEMS} proveedores cuyos productos generaron mayor ganancia neta en el período. No incluye productos sin proveedor asignado`}
            data={data}
            valueLabel="Ganancia neta"
            valueFormatter={Math.formatMoney}
        />
    )
}

export default StatsSuppliers
