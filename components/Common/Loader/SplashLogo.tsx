import Theme from '@/app/theme'
import React from 'react'

const twinkleKeyframes = `
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`

const SplashLogo = () => {
    return (
        <div
            id="splash-logo"
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
            <style>{twinkleKeyframes}</style>
            <div
                id="splash-logo-content"
                style={{
                    textAlign: 'center',
                    animation: 'twinkle 1.2s infinite ease-in-out',
                }}>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                    style={{
                        borderRadius: '50%',
                    }}
                    src="/android-chrome-512x512.png"
                    alt="Managefy"
                    width={200}
                    height={200}
                />
                <h1
                    style={{
                        paddingTop: '1rem',
                        fontFamily: Theme.headings?.fontFamily,
                        letterSpacing: '0.1rem',
                        color: '#16303d',
                        fontSizeAdjust: '1',
                    }}>
                    Managefy
                </h1>
            </div>
        </div>
    )
}

export default SplashLogo
