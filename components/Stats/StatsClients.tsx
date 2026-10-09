import React, { useMemo } from 'react'

import Constant from '@/utils/validation/Constant'
import Math from '@/utils/math/Math'

import CustomBarChart from '@/components/Stats/CustomBarChart'

import Sale from '@/entities/sales/Sale'

interface StatsClientsProps {
    sales: Sale[]
}

// Clients with the highest total bought in the period
const StatsClients = (props: StatsClientsProps) => {
    const { sales } = props

    const data = useMemo(() => Math.getTopClientsByTotal(sales), [sales])

    return (
        <CustomBarChart
            title="Mejores clientes"
            description={`Los ${Constant.STATS_TOP_ITEMS} clientes con mayor monto comprado en el período. No incluye ventas sin cliente asignado`}
            data={data}
            valueLabel="Total comprado"
            valueFormatter={Math.formatMoney}
        />
    )
}

export default StatsClients
