import React from 'react'
import Health from '@/services/health'

const getHealth = async () => {
    try {
        const health = await Health.testAPI()
        return health
    } catch (error) {
        return "Can't connect to Managefy API right now. Try again later."
    }
}

const HomePage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <p>{getHealth()}</p>
            </div>
        </main>
    )
}

export default HomePage
