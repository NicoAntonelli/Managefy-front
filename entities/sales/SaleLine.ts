import Product from '@/entities/products/Product'

interface SaleLine {
    position: number
    amount: number
    price: number
    cost: number
    discountSurcharge?: number | null
    product: Product
}

export default SaleLine
