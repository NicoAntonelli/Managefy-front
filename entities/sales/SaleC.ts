import ClientCU from '@/entities/clients/ClientCU'
import SaleLineC from '@/entities/sales/SaleLineC'
import SaleState from '@/entities/helpTypes/SaleState'

interface SaleC {
    state: SaleState
    partialPayment?: number | null
    observation?: string | null
    businessID: number
    client?: ClientCU | null
    saleLines?: SaleLineC[] | null
}

export default SaleC
