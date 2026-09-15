//////////// PREDEFINED LISTS ////////////

import Theme from '@/app/theme'

import Operation from '@/entities/helpTypes/Operation'
import ResourceName from '@/entities/helpTypes/ResourceName'
import SaleState from '@/entities/helpTypes/SaleState'
import WeekDay from '@/entities/helpTypes/WeekDay'

// List of complete week days
const weekDaysComplete: WeekDay[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

// Create a URL-safe segment with a short random suffix
const createUrlSegment = (value: string): string => {
    const segment = value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    if (!segment) {
        throw new Error('Cannot create a URL segment from an empty string')
    }

    const suffix = Math.random().toString(36).slice(2, 8)
    return `${segment}-${suffix}`
}

// Formats the date both for Date objects and date strings
const dateFormatter = (date: Date | string): string => {
    if (!date) {
        throw new Error('Cannot format an empty date')
    }

    return new Date(date).toLocaleDateString()
}

// Theme-default operation color mapping
const getOperationColor = (operation: Operation) => {
    switch (operation) {
        case 'Create':
            return Theme.primaryColor
        case 'Update':
            return Theme.other!.secondaryColor
        case 'Delete':
            return Theme.other!.danger
    }
}

// Operation text mapping
const getOperationText = (operation: Operation) => {
    switch (operation) {
        case 'Create':
            return 'Crear'
        case 'Update':
            return 'Actualizar'
        case 'Delete':
            return 'Eliminar'
    }
}

// Sale state text mapping
const getSaleStateText = (saleState: SaleState) => {
    switch (saleState) {
        case 'Cancelled':
            return 'Cancelada'
        case 'PendingPayment':
            return 'Pago pendiente'
        case 'PartialPayment':
            return 'Pago parcial'
        case 'Paid':
            return 'Pagada'
        case 'PaidAndBilled':
            return 'Pagada y facturada'
    }
}

// Get the plural form of a resource name
const pluralResourceName = (resourceName: ResourceName): string => {
    switch (resourceName) {
        case 'emprendimiento':
            return 'emprendimientos'
        case 'producto':
            return 'productos'
        case 'proveedor':
            return 'proveedores'
        case 'cliente':
            return 'clientes'
        case 'venta':
            return 'ventas'
        case 'ventas':
            return 'ventas'
    }
}

const TextHelper = {
    weekDaysComplete,
    createUrlSegment,
    dateFormatter,
    getOperationColor,
    getOperationText,
    getSaleStateText,
    pluralResourceName,
}

export default TextHelper
