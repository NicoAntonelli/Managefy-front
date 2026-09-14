import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Table, Tooltip } from '@mantine/core'
import { IconEye, IconX } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Product from '@/entities/products/Product'
import ProductEraseSupplier from '@/components/Products/ProductEraseSupplier'

interface ProductsCompactTableItemProps {
    product: Product
    businessID?: number
    supplierName?: string
    onRemoved?: (productID: number) => void
}

const ProductsCompactTableItem = (props: ProductsCompactTableItemProps) => {
    const { product, businessID, supplierName, onRemoved } = props

    const router = useRouter()

    const [eraseModalOpened, setEraseModalOpened] = useState(false)

    return (
        <Table.Tr
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/products/${product.id}`)}>
            <Table.Td fw={500}>{product.name}</Table.Td>
            <Table.Td c={product.description ? undefined : 'dimmed'}>
                {product.description || 'Sin descripción'}
            </Table.Td>
            <Table.Td style={{ width: '100px', textAlign: 'center' }}>
                <Tooltip label="Ver producto">
                    <ActionIcon
                        component={Link}
                        href={`/products/${product.id}`}
                        variant="outline"
                        color={Theme.other!.secondaryColor}
                        size="sm"
                        aria-label="Ver producto"
                        onClick={(e) => e.stopPropagation()}
                        mr="xs">
                        <IconEye size={16} />
                    </ActionIcon>
                </Tooltip>

                {businessID && supplierName && (
                    <Tooltip label="Remover producto de la lista">
                        <ActionIcon
                            variant="outline"
                            color={Theme.other!.danger}
                            size="sm"
                            aria-label="Remover producto de la lista"
                            onClick={(e) => {
                                e.stopPropagation()
                                setEraseModalOpened(true)
                            }}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Tooltip>
                )}

                {businessID && supplierName && (
                    // Prevent click bubbling beyond the row
                    <div onClick={(e) => e.stopPropagation()}>
                        <ProductEraseSupplier
                            opened={eraseModalOpened}
                            productID={product.id}
                            businessID={businessID}
                            supplierName={supplierName}
                            productName={product.name}
                            onSuccess={() => onRemoved?.(product.id)}
                            onClose={() => setEraseModalOpened(false)}
                        />
                    </div>
                )}
            </Table.Td>
        </Table.Tr>
    )
}

export default ProductsCompactTableItem
