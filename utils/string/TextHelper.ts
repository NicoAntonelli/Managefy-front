//////////// PREDEFINED LISTS ////////////

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

const TextHelper = { weekDaysComplete, createUrlSegment }
export default TextHelper
