import { useEffect, useState } from 'react'
import { Tabs } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Clients from '@/services/clients'
import Products from '@/services/products'
import Sales from '@/services/sales'
import Suppliers from '@/services/suppliers'
import Theme from '@/app/theme'
import DateHelper from '@/utils/math/DateHelper'

import ClientsCompactTable from '@/components/Clients/ClientsCompactTable'
import ProductsCompactTable from '@/components/Products/ProductsCompactTable'
import SalesCompactTable from '@/components/Sales/SalesCompactTable'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
import SuppliersCompactTable from '@/components/Suppliers/SuppliersCompactTable'

import Client from '@/entities/clients/Client'
import Product from '@/entities/products/Product'
import Sale from '@/entities/sales/Sale'
import Supplier from '@/entities/suppliers/Supplier'

interface BusinessDetailResourcesTabsProps {
    businessID: number
}

const BusinessDetailResourcesTabs = (
    props: BusinessDetailResourcesTabsProps
) => {
    const { businessID } = props

    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { dateFrom, dateTo } = DateHelper.getDefaultRange()
                const [productsData, suppliersData, clientsData, salesData] =
                    await Promise.all([
                        Products.listProducts(businessID),
                        Suppliers.listSuppliers(businessID),
                        Clients.listClients(businessID),
                        Sales.listSalesByInterval(businessID, dateFrom, dateTo),
                    ])
                setProducts(productsData || [])
                setSuppliers(suppliersData || [])
                setClients(clientsData || [])
                setSales(salesData || [])
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'No se pudieron cargar los recursos',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchResources()
    }, [businessID])

    if (loading) return <SkeletonSmall />

    return (
        <Tabs defaultValue="products" mt="md">
            <Tabs.List>
                <Tabs.Tab value="products">Productos</Tabs.Tab>
                <Tabs.Tab value="suppliers">Proveedores</Tabs.Tab>
                <Tabs.Tab value="clients">Clientes</Tabs.Tab>
                <Tabs.Tab value="sales">Ventas</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="products">
                <ProductsCompactTable
                    products={products}
                    resourceName="emprendimiento"
                    hideActions
                />
            </Tabs.Panel>
            <Tabs.Panel value="suppliers">
                <SuppliersCompactTable
                    suppliers={suppliers}
                    resourceName="emprendimiento"
                    hideActions
                />
            </Tabs.Panel>
            <Tabs.Panel value="clients">
                <ClientsCompactTable
                    clients={clients}
                    resourceName="emprendimiento"
                    hideActions
                />
            </Tabs.Panel>
            <Tabs.Panel value="sales">
                <SalesCompactTable
                    sales={sales}
                    resourceName="emprendimiento"
                    businessID={businessID}
                    hideActions
                />
            </Tabs.Panel>
        </Tabs>
    )
}

export default BusinessDetailResourcesTabs
