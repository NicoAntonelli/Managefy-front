//////////// PREDEFINED LISTS ////////////

import Theme from '@/app/theme'

import Operation from '@/entities/helpTypes/Operation'
import ResourceName from '@/entities/helpTypes/ResourceName'
import Role from '@/entities/helpTypes/Role'
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

    return new Date(date).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
    })
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
        default:
            return Theme.primaryColor
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
        default:
            return operation
    }
}

// Theme-default role color mapping
const getRoleColor = (role: Role) => {
    switch (role) {
        case 'Manager':
            return 'pink'
        case 'Admin':
            return 'red'
        case 'Collaborator':
            return 'green'
        default:
            return Theme.primaryColor
    }
}

// Role text mapping
const getRoleText = (role: Role) => {
    switch (role) {
        case 'Manager':
            return 'Manager'
        case 'Admin':
            return 'Admin'
        case 'Collaborator':
            return 'Colaborador'
        default:
            return role
    }
}

// Theme-default sale state color mapping
const getSaleStateColor = (saleState: SaleState) => {
    switch (saleState) {
        case 'Cancelled':
            return Theme.other!.danger
        case 'PendingPayment':
            return Theme.primaryColor
        case 'PartialPayment':
            return Theme.other!.secondaryColor
        case 'Paid':
            return Theme.other!.success
        case 'PaidAndBilled':
            return Theme.other!.success
        default:
            return Theme.primaryColor
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
        default:
            return saleState
    }
}

// Theme-default business visibility color mapping
const getVisibilityColor = (isPublic: boolean) => {
    return isPublic ? Theme.primaryColor : Theme.other!.secondaryColor
}

// Business visibility text mapping
const getVisibilityText = (isPublic: boolean) => {
    return isPublic ? 'Público' : 'Privado'
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
        default:
            return resourceName
    }
}

const TextHelper = {
    weekDaysComplete,
    createUrlSegment,
    dateFormatter,
    getOperationColor,
    getOperationText,
    getRoleColor,
    getRoleText,
    getSaleStateColor,
    getSaleStateText,
    getVisibilityColor,
    getVisibilityText,
    pluralResourceName,
}

export default TextHelper
