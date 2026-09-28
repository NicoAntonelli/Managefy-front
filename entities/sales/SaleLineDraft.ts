import Product from '@/entities/products/Product'

// In-progress sale line used while creating a sale, before being converted to SaleLineC
interface SaleLineDraft {
    product: Product
    amount: number | null
    discountPercentage?: number | null
}

export default SaleLineDraft
