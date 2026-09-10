//////////// VALIDATION TOOLS ////////////

import RegEx from '@/utils/string/RegEx'

// Main numeric constants
const MAX_SAFE_NUMBER = 1000000000000 // Billon (Short scale) or Thousand Million (Long scale)

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

// String field validation for positive decimals contained in string format
const decimalString = (value: string, allowZero: boolean = false): boolean => {
    if (!string(value)) return false

    return decimal(Number(value), allowZero)
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

// String field validation for positive integers contained in string format
const integerString = (value: string, allowZero: boolean = false): boolean => {
    if (!string(value)) return false

    return integer(Number(value), allowZero)
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
const string = (value?: string): boolean => {
    if (!value) return false
    if (value.trim().length == 0) return false

    return true
}

const Validation = {
    decimal,
    decimalString,
    email,
    integer,
    integerString,
    password,
    phone,
    string,
    urlSegment,
}

export default Validation
