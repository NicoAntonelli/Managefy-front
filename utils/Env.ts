//////////// ENV TOOLS ////////////

// Working mode
const mode: string = process.env.NEXT_PUBLIC_WORKING_MODE ?? 'dev'

// Base frontend URL
const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL ?? ''

// Base backend API
const backendAPI: string =
    mode == 'prod'
        ? process.env.NEXT_PUBLIC_API_URL_PROD ?? ''
        : process.env.NEXT_PUBLIC_API_URL_DEV ?? ''

// Managefy contact mail
const contactMail: string = process.env.NEXT_PUBLIC_CONTACT ?? ''

const Env = { mode, backendAPI, baseURL, contactMail }
export default Env
