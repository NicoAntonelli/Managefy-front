//////////// DATE-RELATED TOOLS ////////////

import Constant from '@/utils/validation/Constant'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

// Formats the date both for Date objects and date strings
const formatDateTime = (date: Date | string, isFileName?: boolean): string => {
    if (!date) {
        throw new Error('Cannot format an empty date')
    }

    const parsedDate = new Date(date)

    // Format output for file names: yyyy-MM-dd HH-mm-ss
    if (isFileName) {
        const year = parsedDate.getFullYear()
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
        const day = String(parsedDate.getDate()).padStart(2, '0')
        const hours = String(parsedDate.getHours()).padStart(2, '0')
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
        const seconds = String(parsedDate.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
    }

    // Format output default: dd/MM/yyyy HH:mm
    return parsedDate
        .toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(',', '')
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
    const dateTo = today()
    const dateFrom = today()
    dateFrom.setMonth(dateFrom.getMonth() - Constant.DEFAULT_INTERVAL_MONTHS)

    return {
        dateFrom: getDateInputValue(dateFrom),
        dateTo: getDateInputValue(dateTo, true),
    }
}

// Today's date
const today = (): Date => new Date()

// Tomorrow's date
const tomorrow = (): Date => {
    const todayDate = today()
    return new Date(todayDate.setDate(todayDate.getDate() + 1))
}

const DateHelper = {
    formatDateTime,
    getDateInputValue,
    getDefaultRange,
    today,
    tomorrow,
}

export default DateHelper
