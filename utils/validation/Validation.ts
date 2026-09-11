//////////// VALIDATION TOOLS ////////////

import RegEx from '@/utils/string/RegEx'

// Main numeric constants
const MAX_SAFE_NUMBER = 1000000000000 // Billon (Short scale) or Thousand Million (Long scale)
const MAX_STRING_SIZE_TITLE = 200
const MAX_STRING_SIZE_DESCRIPTION = 800
const CACHE_DURATION_MS = 10 * 60 * 1000 // 10 minutes

// Validate if a cache is still valid
const cache = (cachedAt: number | null): boolean => {
    if (cachedAt === null) return false
    return Date.now() - cachedAt < CACHE_DURATION_MS
}

// Positive decimal field validation
const decimal = (value: number | null, allowZero: boolean = false): boolean => {
    if (value === null || value === undefined) return false
    if (isNaN(value)) return false
    if (value === 0 && !allowZero) return false

    const num = typeof value === 'number' ? value : Number(value)
    if (!isFinite(num)) return false
    if (num < 0 || num > MAX_SAFE_NUMBER) return false

    return true
}

// Email field validation
const email = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.email.test(value)) return false

    return true
}

// Positive integer field validation
const integer = (value: number | null, allowZero: boolean = false): boolean => {
    if (!decimal(value, allowZero)) return false
    if (!Number.isInteger(Number(value))) return false

    return true
}

// Password field validation
const password = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.password.test(value)) return false

    return true
}

// Phone field validation
const phone = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.phone.test(value)) return false

    return true
}

// URL path segment validation
const urlSegment = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.urlSegment.test(value)) return false

    return true
}

// String field validation
const string = (value?: string, isDescription: boolean = false): boolean => {
    if (!value) return false
    if (value.trim().length == 0) return false

    if (value.length > MAX_STRING_SIZE_DESCRIPTION) return false
    if (!isDescription && value.length > MAX_STRING_SIZE_TITLE) return false

    return true
}

const Validation = {
    cache,
    decimal,
    email,
    integer,
    password,
    phone,
    string,
    urlSegment,
}

export default Validation
