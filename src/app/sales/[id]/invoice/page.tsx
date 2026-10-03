'use client'
import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import SaleInvoice from '@/components/Sales/SaleInvoice'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

const SaleInvoicePageContent = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const saleID = params?.id ? Number(params.id) : 0
    const businessID = Number(searchParams.get('businessID'))

    return <SaleInvoice saleID={saleID} businessID={businessID} />
}

const SaleInvoicePage = () => {
    return (
        <Suspense fallback={<SkeletonFull />}>
            <SaleInvoicePageContent />
        </Suspense>
    )
}

export default SaleInvoicePage
