import Client from '@/entities/clients/Client'
import Product from '@/entities/products/Product'
import Sale from '@/entities/sales/Sale'
import Supplier from '@/entities/suppliers/Supplier'
import UserRole from '@/entities/userRoles/UserRole'

interface BusinessResources {
    businessID: number
    clients: Client[]
    products: Product[]
    sales: Sale[]
    suppliers: Supplier[]
    userRoles: UserRole[]
}

export default BusinessResources
