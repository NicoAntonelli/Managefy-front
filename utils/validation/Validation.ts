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
    if (!Number.isInteger(value)) return false
    if (value < 0) return false

    return true
}

// Password field validation
const password = (value: string): boolean => {
    if (!string(value)) return false
    if (!RegEx.password.test(value)) return false

    console.log('Password is valid')

    return true
}

// String field validation
const string = (value?: string): boolean => {
    if (!value) return false
    if (value.trim().length == 0) return false

    return true
}

const Validation = { email, integer, password, string }
export default Validation
