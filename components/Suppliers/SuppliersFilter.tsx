import React, { useState } from 'react'
import { IconCheck } from '@tabler/icons-react'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import SuppliersDropdown from '@/components/Suppliers/SuppliersDropdown'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersFilterProps {
    businessID: number
    appliedSupplier: Supplier | null
    onApply: (supplier: Supplier | null) => void
    onClose: () => void
}

const SuppliersFilter = (props: SuppliersFilterProps) => {
    const { businessID, appliedSupplier, onApply, onClose } = props
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        appliedSupplier
    )

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        onApply(selectedSupplier)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit}>
            <SuppliersDropdown
                businessID={businessID}
                initialSupplier={selectedSupplier}
                forceRefresh={!!selectedSupplier}
                onChange={setSelectedSupplier}
            />
            <ButtonsSubmitAndCancel
                operation="Create"
                operationText="Aceptar"
                leftIcon={<IconCheck />}
                submitting={false}
                onCancel={onClose}
            />
        </form>
    )
}

export default SuppliersFilter
