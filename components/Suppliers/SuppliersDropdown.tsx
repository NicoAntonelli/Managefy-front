import { useEffect, useState } from 'react'
import {
    ActionIcon,
    Checkbox,
    Group,
    Stack,
    Text,
    Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconRefresh, IconUserCog } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Suppliers from '@/services/suppliers'
import Validation from '@/utils/validation/Validation'

import Theme from '@/app/theme'

import CustomDropdown from '@/components/Common/CustomDropdown/CustomDropdown'
import SuppliersDropdownItem from '@/components/Suppliers/SuppliersDropdownItem'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersDropdownProps {
    businessID: number
    initialSupplier?: Supplier | null
    forceRefresh?: boolean
    withinPortal?: boolean
    onChange: (supplier: Supplier | null) => void
}

const SuppliersDropdown = (props: SuppliersDropdownProps) => {
    const { businessID, initialSupplier } = props
    const { forceRefresh = false, withinPortal = true, onChange } = props

    const [enabled, setEnabled] = useState(!!initialSupplier)
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
    const [selectedID, setSelectedID] = useState<string | null>(
        initialSupplier ? String(initialSupplier.id) : null
    )

    const [cachedAt, setCachedAt] = useState<number | null>(null)
    const [cachedBusinessID, setCachedBusinessID] = useState<number | null>(
        null
    )

    const selectSupplier = (supplier: Supplier | null) => {
        setSelectedID(supplier ? String(supplier.id) : null)
        onChange(supplier)
    }

    const fetchSuppliers = async () => {
        setLoading(true)

        try {
            const response = await Suppliers.listSuppliers(businessID)

            // Cache the current suppliers list, timestamp and businessID
            setSuppliers(response ?? [])
            setCachedAt(Date.now())
            setCachedBusinessID(businessID)

            return response
        } catch (error) {
            setSuppliers([])
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message:
                    message ||
                    'Error al obtener los proveedores. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (forceRefresh) {
            fetchSuppliers()
        }
    }, [forceRefresh])

    // Checkbox toggle
    const handleToggle = async (checked: boolean) => {
        setEnabled(checked)
        if (!checked) {
            selectSupplier(null)
            return
        }

        const isCacheValid =
            suppliers !== null &&
            cachedBusinessID === businessID &&
            cachedAt !== null &&
            Validation.cache(cachedAt)

        if (isCacheValid) {
            selectSupplier(suppliers[0] ?? null)
            return
        }

        const response = await fetchSuppliers()
        selectSupplier(response?.[0] ?? null)
    }

    // Full list not loaded yet, only a preselected supplier
    const showRefresh = enabled && suppliers === null && !forceRefresh

    const availableSuppliers =
        suppliers ?? (initialSupplier ? [initialSupplier] : [])
    const selectedSupplier = availableSuppliers.find(
        (supplier) => String(supplier.id) === selectedID
    )

    const filterPredicate = (supplier: Supplier, query: string) => {
        const matchesName = supplier.name?.toLowerCase().includes(query)
        const matchesDesc = supplier.description?.toLowerCase().includes(query)
        const matchesEmail = supplier.email?.toLowerCase().includes(query)
        return Boolean(matchesName || matchesDesc || matchesEmail)
    }

    const placeholder = !enabled
        ? 'Ninguno'
        : suppliers === null || loading
          ? 'Cargando proveedores...'
          : suppliers.length === 0
            ? 'No hay proveedores para mostrar'
            : 'Seleccionar proveedor...'

    return (
        <Stack gap="xs" mt="md">
            <Text size="sm" fw={500}>
                Proveedor (opcional)
            </Text>
            <Group align="center" gap="sm">
                <Checkbox
                    checked={enabled}
                    onChange={(event) =>
                        handleToggle(event.currentTarget.checked)
                    }
                />
                <CustomDropdown<Supplier>
                    items={availableSuppliers}
                    value={enabled ? (selectedSupplier ?? null) : null}
                    getItemKey={(supplier) => supplier.id}
                    getItemLabel={(supplier) => supplier.name}
                    filterPredicate={filterPredicate}
                    onSelect={(supplier) => selectSupplier(supplier)}
                    loading={loading}
                    disabled={!enabled || loading || suppliers?.length === 0}
                    withinPortal={withinPortal}
                    placeholder={placeholder}
                    searchPlaceholder="Buscar por nombre, descripción o email..."
                    emptyText="No se encontraron proveedores coincidentes"
                    leftIcon={<IconUserCog size={18} />}
                    renderOption={(supplier) => (
                        <SuppliersDropdownItem
                            supplier={supplier}
                            isSelected={supplier.id === selectedSupplier?.id}
                        />
                    )}
                />
                {showRefresh && (
                    <Tooltip label="Cargar todos los proveedores">
                        <ActionIcon
                            variant="light"
                            size="lg"
                            loading={loading}
                            onClick={fetchSuppliers}>
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
        </Stack>
    )
}

export default SuppliersDropdown
