//////////// TEXT-RELATED TOOLS ////////////

import Theme from '@/app/theme'
import DateHelper from '@/utils/math/DateHelper'

import NotificationType from '@/entities/helpTypes/NotificationType'
import Operation from '@/entities/helpTypes/Operation'
import ResourceName from '@/entities/helpTypes/ResourceName'
import Role from '@/entities/helpTypes/Role'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'
import SaleState from '@/entities/helpTypes/SaleState'
import StatsGrouping from '@/entities/helpTypes/StatsGrouping'
import StatsPeriod from '@/entities/helpTypes/StatsPeriod'
import WeekDay from '@/entities/helpTypes/WeekDay'

// List of all possible sale states
const saleStatesComplete: SaleState[] = [
    'PendingPayment',
    'PartialPayment',
    'Paid',
    'PaidAndBilled',
    'Cancelled',
]

// List of all statistics periods
const statsPeriodsComplete: StatsPeriod[] = [
    'Week',
    'Month',
    'ThreeMonths',
    'SixMonths',
    'TwelveMonths',
]

// List of all week days
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

// Theme-default notification type color mapping
const getNotificationTypeColor = (notificationType: NotificationType) => {
    switch (notificationType) {
        case 'Low':
            return Theme.other!.neutral
        case 'Normal':
            return Theme.primaryColor
        case 'Priority':
            return Theme.other!.danger
        default:
            return Theme.primaryColor
    }
}

// Notification type text mapping
const getNotificationTypeText = (notificationType: NotificationType) => {
    switch (notificationType) {
        case 'Low':
            return 'Baja'
        case 'Normal':
            return 'Normal'
        case 'Priority':
            return 'Prioritaria'
        default:
            return notificationType
    }
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

// Statistics time grouping text mapping
const getStatsGroupingText = (grouping: StatsGrouping) => {
    switch (grouping) {
        case 'Day':
            return 'día'
        case 'Week':
            return 'semana'
        case 'Month':
            return 'mes'
        default:
            return grouping
    }
}

// Statistics period short text mapping
const getStatsPeriodText = (period: StatsPeriod) => {
    switch (period) {
        case 'Week':
            return 'Semana'
        case 'Month':
            return 'Mes'
        case 'ThreeMonths':
            return '3 meses'
        case 'SixMonths':
            return '6 meses'
        case 'TwelveMonths':
            return '12 meses'
        default:
            return period
    }
}

// Statistics period text mapping, for titles ("Estadísticas de la última semana")
const getStatsPeriodTitleText = (period: StatsPeriod) => {
    switch (period) {
        case 'Week':
            return 'de la última semana'
        case 'Month':
            return 'del último mes'
        case 'ThreeMonths':
            return 'de los últimos 3 meses'
        case 'SixMonths':
            return 'de los últimos 6 meses'
        case 'TwelveMonths':
            return 'de los últimos 12 meses'
        default:
            return period
    }
}

// Statistics title: by period, or by the custom range when there is no period
const getStatsTitle = (period: StatsPeriod | null, range: SalesDateRange) => {
    if (period) return `Estadísticas ${getStatsPeriodTitleText(period)}`

    const dateFrom = DateHelper.formatDateInputValue(range.dateFrom)
    const dateTo = DateHelper.formatDateInputValue(range.dateTo)

    return `Estadísticas del rango entre ${dateFrom} y ${dateTo}`
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
        case 'estadísticas':
            return 'estadísticas'
        default:
            return resourceName
    }
}

const TextHelper = {
    saleStatesComplete,
    statsPeriodsComplete,
    weekDaysComplete,
    createUrlSegment,
    getNotificationTypeColor,
    getNotificationTypeText,
    getOperationColor,
    getOperationText,
    getRoleColor,
    getRoleText,
    getSaleStateColor,
    getSaleStateText,
    getStatsGroupingText,
    getStatsPeriodText,
    getStatsPeriodTitleText,
    getStatsTitle,
    getVisibilityColor,
    getVisibilityText,
    pluralResourceName,
}

export default TextHelper
