//////////// VALIDATION TOOLS ////////////

import RegEx from '@/utils/string/RegEx'

// Email field validation
const email = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.email.test(value)) return false

    return true
}

// Positive integer field validation
const integer = (value: number): boolean => {
    if (!value) return false
    if (isNaN(value)) return false

    const num = typeof value === 'number' ? value : Number(value)
    if (!Number.isInteger(num)) return false
    if (num < 0) return false

    return true
}

// String field validation for positive integers contained in string format
const integerString = (value: string): boolean => {
    if (!string(value)) return false

    return integer(Number(value))
}

// Password field validation
const password = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.password.test(value)) return false

    console.log('Password is valid')

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
    email,
    integer,
    integerString,
    password,
    string,
    urlSegment,
}
export default Validation
