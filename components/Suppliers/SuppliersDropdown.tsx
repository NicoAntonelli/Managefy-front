import { useState } from 'react'
import { Checkbox, Group, Loader, Select, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconChevronDown, IconUserCog } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Suppliers from '@/services/suppliers'
import Validation from '@/utils/validation/Validation'

import Theme from '@/app/theme'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersDropdownProps {
    businessID: number
    onChange: (supplier: Supplier | null) => void
}

const SuppliersDropdown = (props: SuppliersDropdownProps) => {
    const { businessID, onChange } = props

    const [enabled, setEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
    const [selectedID, setSelectedID] = useState<string | null>(null)

    const [cachedAt, setCachedAt] = useState<number | null>(null)
    const [cachedBusinessID, setCachedBusinessID] = useState<number | null>(
        null
    )

    const selectSupplier = (supplier: Supplier | null) => {
        setSelectedID(supplier ? String(supplier.id) : null)
        onChange(supplier)
    }

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

        setLoading(true)

        try {
            const response = await Suppliers.listSuppliers(businessID)

            // Cache the current suppliers list, timestamp and businessID
            setSuppliers(response)
            setCachedAt(Date.now())
            setCachedBusinessID(businessID)

            selectSupplier(response[0] ?? null)
        } catch (error) {
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message:
                    message ||
                    'Error al obtener los proveedores. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSelectChange = (value: string | null) => {
        const supplier = suppliers?.find((s) => String(s.id) === value) ?? null
        selectSupplier(supplier)
    }

    const placeholder = !enabled
        ? 'Ninguno'
        : suppliers?.length === 0
          ? 'No hay proveedores para mostrar'
          : 'Seleccione un proveedor'

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
                <Select
                    flex={1}
                    leftSection={<IconUserCog size={18} />}
                    rightSection={
                        loading ? (
                            <Loader size={18} />
                        ) : (
                            <IconChevronDown size={18} />
                        )
                    }
                    placeholder={placeholder}
                    disabled={!enabled || loading || suppliers?.length === 0}
                    data={(suppliers ?? []).map((supplier) => ({
                        value: String(supplier.id),
                        label: supplier.name,
                    }))}
                    value={enabled ? selectedID : null}
                    onChange={handleSelectChange}
                />
            </Group>
        </Stack>
    )
}

export default SuppliersDropdown
