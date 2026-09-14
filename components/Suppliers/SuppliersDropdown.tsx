import { useEffect, useState } from 'react'
import {
    ActionIcon,
    Checkbox,
    Combobox,
    Group,
    Loader,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Tooltip,
    useCombobox,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconChevronDown,
    IconRefresh,
    IconSearch,
    IconUserCog,
} from '@tabler/icons-react'

import Helper from '@/services/helper'
import Suppliers from '@/services/suppliers'
import Validation from '@/utils/validation/Validation'

import Theme from '@/app/theme'

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

    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption()
        },
    })

    const [enabled, setEnabled] = useState(!!initialSupplier)
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
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

    const handleSelectChange = (value: string | null) => {
        const options = suppliers ?? (initialSupplier ? [initialSupplier] : [])
        const supplier = options.find((s) => String(s.id) === value) ?? null
        selectSupplier(supplier)
        combobox.closeDropdown()
    }

    // Full list not loaded yet, only a preselected supplier
    const showRefresh = enabled && suppliers === null && !forceRefresh

    const availableSuppliers =
        suppliers ?? (initialSupplier ? [initialSupplier] : [])
    const filteredSuppliers = availableSuppliers.filter((supplier) => {
        if (!searchQuery.trim()) return true
        return supplier.name
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
    })
    const selectedSupplier = availableSuppliers.find(
        (supplier) => String(supplier.id) === selectedID
    )

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
                <Combobox
                    store={combobox}
                    onOptionSubmit={handleSelectChange}
                    withinPortal={withinPortal}>
                    <Combobox.Target>
                        <TextInput
                            flex={1}
                            value={
                                enabled ? (selectedSupplier?.name ?? '') : ''
                            }
                            placeholder={placeholder}
                            leftSection={<IconUserCog size={18} />}
                            rightSection={
                                loading ? (
                                    <Loader size={18} />
                                ) : (
                                    <IconChevronDown size={18} />
                                )
                            }
                            readOnly
                            disabled={
                                !enabled || loading || suppliers?.length === 0
                            }
                            onClick={() => combobox.toggleDropdown()}
                            style={{ cursor: 'pointer' }}
                            styles={{
                                input: {
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Search
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.currentTarget.value)
                            }
                            placeholder="Buscar proveedor..."
                            leftSection={<IconSearch size={16} />}
                        />
                        <Combobox.Options>
                            <ScrollArea.Autosize type="scroll" mah={220}>
                                {loading && (
                                    <Combobox.Empty>
                                        <Group justify="center" p="xs">
                                            <Loader size="sm" />
                                        </Group>
                                    </Combobox.Empty>
                                )}

                                {!loading && filteredSuppliers.length === 0 && (
                                    <Combobox.Empty>
                                        No se encontraron proveedores
                                        coincidentes
                                    </Combobox.Empty>
                                )}

                                {!loading &&
                                    filteredSuppliers.map((supplier) => (
                                        <Combobox.Option
                                            value={String(supplier.id)}
                                            key={supplier.id}>
                                            <Group gap="xs">
                                                <IconUserCog size={16} />
                                                <div>
                                                    <Text size="sm">
                                                        {supplier.name}
                                                    </Text>
                                                    {supplier.email && (
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                            lineClamp={1}>
                                                            {supplier.email}
                                                        </Text>
                                                    )}
                                                </div>
                                            </Group>
                                        </Combobox.Option>
                                    ))}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
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
