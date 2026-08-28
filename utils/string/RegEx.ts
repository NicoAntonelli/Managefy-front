//////////// REGEX TOOLS ////////////

// Email: standard cases validation
const email: RegExp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

// Password: at least one uppercase letter, one lowercase letter, one number and one symbol. 8 to 30 characters.
const password: RegExp = new RegExp(
    /^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/
)

// URL path segment: words separated by single hyphens
const urlSegment: RegExp = new RegExp(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)

const RegEx = { email, password, urlSegment }
export default RegEx
