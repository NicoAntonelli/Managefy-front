import React from 'react'

const SplashLogo = () => {
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                verticalAlign: 'middle',
                background:
                    'radial-gradient(circle,rgba(255, 255, 255, 1) 0%, rgba(253, 210, 193, 1) 50%, rgba(218, 172, 156, 1) 100%)',
            }}>
            {/* eslint-disable @next/next/no-img-element */}
            <img
                style={{ borderRadius: '50%' }}
                src="/android-chrome-512x512.png"
                alt="Managefy"
                width={200}
                height={200}
            />
            <h1
                style={{
                    fontFamily: 'Roboto',
                    letterSpacing: '0.2rem',
                    color: '#fdd2c1',
                }}>
                Managefy
            </h1>
        </div>
    )
}

export default SplashLogo
