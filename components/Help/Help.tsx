import React from 'react'
import { Affix, Button, Transition } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconArrowUp } from '@tabler/icons-react'

import ReportBug from './ReportBug'
import TermsConditions from './TermsConditions'

const Help = () => {
    const [scroll, scrollTo] = useWindowScroll()

    return (
        <>
            <ReportBug />
            <TermsConditions />

            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={<IconArrowUp size="1rem" />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}>
                            Volver arriba
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    )
}

export default Help
