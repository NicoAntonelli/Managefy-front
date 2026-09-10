//////////// REGEX TOOLS ////////////

// Replace non-digit characters with empty string
const cleanInteger = (value: string): string => value.replace(/[^\d]/g, '')

// Replace non-digit characters (but ONE point) with empty string and handle non-valid formats
const cleanDecimal = (value: string): string => {
    let filtered: string = value.replace(/[^\d.]/g, '')
    const parts: string[] = filtered.split('.')
    if (parts.length > 2) filtered = `${parts[0]}.${parts.slice(1).join('')}`

    return filtered
}

// Email: standard cases validation
const email: RegExp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

// Password: at least one uppercase letter, one lowercase letter, one number and one symbol. 8 to 30 characters.
const password: RegExp = new RegExp(
    /^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/
)

// Phone: only digits, between 5 and 18 characters
const phone: RegExp = new RegExp(/^\d{5,18}$/)

// URL path segment: words separated by single hyphens
const urlSegment: RegExp = new RegExp(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)

const RegEx = { cleanDecimal, cleanInteger, email, password, phone, urlSegment }
export default RegEx
