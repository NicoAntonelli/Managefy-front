import { useEffect, useState } from 'react'

import CheckUserLogin from '@/entities/helpTypes/CheckUserLogin'
import Users from '@/services/users'

// Checks if the user is logged in and if the account validation is completed
const useCheckUserLogin = (): CheckUserLogin => {
    const [isLogged, setIsLogged] = useState<boolean | null>(null)
    const [isValidated, setIsValidated] = useState<boolean | null>(null)

    useEffect(() => {
        const checkUserLogin = async () => {
            const checkUserLogin: CheckUserLogin =
                await Users.checkSessionAndValidation()

            setIsLogged(checkUserLogin.isLogged)
            setIsValidated(checkUserLogin.isValidated)
        }
        checkUserLogin()
    }, [])

    return { isLogged, isValidated }
}

export default useCheckUserLogin
