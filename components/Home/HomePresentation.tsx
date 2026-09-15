import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Group, Image, Stack, Text, Title } from '@mantine/core'

import Theme from '@/app/theme'

interface HomePresentationProps {
    hideBorder?: boolean
    isTermsAndConditions?: boolean
}

const HomePresentation = (props: HomePresentationProps) => {
    const { hideBorder = false, isTermsAndConditions = false } = props
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.md})`)

    // Refs and state to detect if the text stack has wrapped below the image
    const imageWrapperRef = useRef<HTMLDivElement>(null)
    const stackRef = useRef<HTMLDivElement>(null)
    const [isStacked, setIsStacked] = useState(false)

    useEffect(() => {
        const imageEl = imageWrapperRef.current
        const stackEl = stackRef.current
        if (!imageEl || !stackEl) return

        const checkLayout = () => {
            const imageRect = imageEl.getBoundingClientRect()
            const stackRect = stackEl.getBoundingClientRect()
            setIsStacked(stackRect.top >= imageRect.bottom)
        }

        checkLayout()

        const resizeObserver = new ResizeObserver(checkLayout)
        resizeObserver.observe(imageEl)
        resizeObserver.observe(stackEl)

        return () => resizeObserver.disconnect()
    }, [])

    return (
        <Card
            shadow={hideBorder ? 'null' : 'sm'}
            padding="lg"
            radius="md"
            withBorder={!hideBorder}
            w="100%">
            <Card.Section p="1rem">
                <Group justify="flex-start" gap={isMobile ? '1rem' : '2rem'}>
                    <div
                        ref={imageWrapperRef}
                        style={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            minWidth: 'fit-content',
                        }}>
                        <Image
                            src="/Managefy-logo.jpeg"
                            alt="Managefy logo"
                            h={isMobile ? 140 : 280}
                            w="auto"
                            radius="md"
                        />
                    </div>
                    <Stack
                        ref={stackRef}
                        gap="0.25rem"
                        style={{ flexGrow: 999, flexBasis: '22rem' }}>
                        <Title
                            size={isMobile ? '2rem' : '4rem'}
                            ta={isStacked ? 'center' : 'left'}>
                            Managefy
                        </Title>
                        {isTermsAndConditions ? (
                            <>
                                <Title size={isMobile ? '1.5rem' : '3.5rem'}>
                                    Términos y Condiciones de Uso
                                </Title>
                                <Text
                                    size={isMobile ? '1rem' : '1.75rem'}
                                    mt={isMobile ? '0.5rem' : '1.5rem'}>
                                    Última actualización: <b>24/11/2025</b>
                                </Text>
                            </>
                        ) : (
                            <Text
                                size={isMobile ? '1rem' : '1.75rem'}
                                mt={isMobile ? '0.5rem' : '1.5rem'}
                                ta={isStacked ? 'center' : 'left'}>
                                <b>
                                    Gestión de recursos fácil de usar para su
                                    emprendimiento
                                </b>
                            </Text>
                        )}
                    </Stack>
                </Group>
            </Card.Section>
        </Card>
    )
}

export default HomePresentation
