import { ActionIcon, Badge } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface ProductsSelectionAreaItemProps {
    name: string
    removable?: boolean
    onRemove: () => void
}

const ProductsSelectionAreaItem = (props: ProductsSelectionAreaItemProps) => {
    const { name, removable = true, onRemove } = props

    return (
        <Badge
            size="lg"
            variant="light"
            color={Theme.primaryColor}
            rightSection={
                removable ? (
                    <ActionIcon
                        size="xs"
                        color="gray"
                        radius="xl"
                        variant="transparent"
                        onClick={onRemove}
                        aria-label={`Remover ${name}`}>
                        <IconX size={12} />
                    </ActionIcon>
                ) : undefined
            }>
            {name}
        </Badge>
    )
}

export default ProductsSelectionAreaItem
