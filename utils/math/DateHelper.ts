//////////// DATE-RELATED TOOLS ////////////

import Constant from '@/utils/validation/Constant'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

// Formats the date both for Date objects and date strings
const formatDateTime = (date: Date | string): string => {
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

// Formats a date for use in HTML date input fields (YYYY-MM-DD)
const getDateInputValue = (date: Date, addOneDay?: boolean): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate() + (addOneDay ? 1 : 0)).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// Gets the default date range for sales filtering based on the constant interval
const getDefaultRange = (): SalesDateRange => {
    const dateTo = new Date()
    const dateFrom = new Date()
    dateFrom.setMonth(dateFrom.getMonth() - Constant.DEFAULT_INTERVAL_MONTHS)

    return {
        dateFrom: getDateInputValue(dateFrom),
        dateTo: getDateInputValue(dateTo, true),
    }
}

const DateHelper = { formatDateTime, getDateInputValue, getDefaultRange }

export default DateHelper
