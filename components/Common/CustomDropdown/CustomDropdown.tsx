import { useState } from 'react'
import type { ReactNode } from 'react'
import {
    Combobox,
    Group,
    Loader,
    ScrollArea,
    Text,
    TextInput,
    useCombobox,
} from '@mantine/core'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'

interface CustomDropdownProps<T> {
    items: T[]
    getItemKey: (item: T) => string | number
    getItemLabel: (item: T) => string
    onSelect: (item: T) => void
    value?: T | null
    targetLabel?: string
    loading?: boolean
    disabled?: boolean
    closeOnSelect?: boolean
    withinPortal?: boolean
    filterPredicate?: (item: T, query: string) => boolean
    isItemDisabled?: (item: T) => boolean
    renderOption?: (item: T) => ReactNode
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    leftIcon?: ReactNode
    maxDropdownHeight?: number
    flex?: number | string
}

// Customizable & searchable dropdown component
const CustomDropdown = <T,>(props: CustomDropdownProps<T>) => {
    const { items, getItemKey, getItemLabel, onSelect } = props
    const { value = null, targetLabel } = props
    const { loading = false, disabled = false } = props
    const { closeOnSelect = true, withinPortal = true } = props
    const { filterPredicate, isItemDisabled, renderOption } = props
    const {
        placeholder = 'Seleccionar...',
        searchPlaceholder = 'Buscar...',
        emptyText = 'No se encontraron resultados',
    } = props

    const { leftIcon, maxDropdownHeight = 220, flex = 1 } = props

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    const [searchQuery, setSearchQuery] = useState('')

    const filteredItems = items.filter((item) => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.trim().toLowerCase()
        return filterPredicate
            ? filterPredicate(item, query)
            : getItemLabel(item).toLowerCase().includes(query)
    })

    const handleOptionSubmit = (selectedValue: string) => {
        const item = items.find(
            (option) => String(getItemKey(option)) === selectedValue
        )

        if (item && !isItemDisabled?.(item)) onSelect(item)
        if (closeOnSelect) combobox.closeDropdown()
    }

    const targetValue = targetLabel ?? (value ? getItemLabel(value) : '')

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOptionSubmit}
            withinPortal={withinPortal}>
            <Combobox.Target>
                <TextInput
                    flex={flex}
                    value={targetValue}
                    placeholder={placeholder}
                    leftSection={leftIcon}
                    rightSection={
                        loading ? (
                            <Loader size={18} />
                        ) : (
                            <IconChevronDown size={18} />
                        )
                    }
                    readOnly
                    disabled={disabled}
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
                    placeholder={searchPlaceholder}
                    leftSection={<IconSearch size={16} />}
                />
                <Combobox.Options>
                    <ScrollArea.Autosize type="scroll" mah={maxDropdownHeight}>
                        {loading && (
                            <Combobox.Empty>
                                <Group justify="center" p="xs">
                                    <Loader size="sm" />
                                </Group>
                            </Combobox.Empty>
                        )}

                        {!loading && filteredItems.length === 0 && (
                            <Combobox.Empty>{emptyText}</Combobox.Empty>
                        )}

                        {!loading &&
                            filteredItems.map((item) => (
                                <Combobox.Option
                                    value={String(getItemKey(item))}
                                    key={getItemKey(item)}
                                    disabled={isItemDisabled?.(item)}>
                                    {renderOption ? (
                                        renderOption(item)
                                    ) : (
                                        <Text size="sm">
                                            {getItemLabel(item)}
                                        </Text>
                                    )}
                                </Combobox.Option>
                            ))}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default CustomDropdown
