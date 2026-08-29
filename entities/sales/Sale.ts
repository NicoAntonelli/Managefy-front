import Business from '@/entities/businesses/Business'
import ClientCU from '@/entities/clients/ClientCU'
import SaleLine from '@/entities/sales/SaleLine'
import SaleState from '@/entities/helpTypes/SaleState'

interface Sale {
    id: number
    date: Date
    totalPrice: number
    partialPayment?: number | null
    state: SaleState
    observation?: string | null
    business: Business
    client?: ClientCU | null
    saleLines?: SaleLine[] | null
}

export default Sale
