import React from 'react'
import { Group, Text, Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

interface StatsCardTitleProps {
    title: string
    description: string // What the chart measures, shown in a tooltip next to the title
    dimmed?: boolean
}

const StatsCardTitle = (props: StatsCardTitleProps) => {
    const { title, description, dimmed } = props

    return (
        <Group gap={6} wrap="nowrap">
            <Text
                fw={dimmed ? 500 : 600}
                size={dimmed ? 'sm' : 'md'}
                c={dimmed ? 'dimmed' : undefined}>
                {title}
            </Text>
            <Tooltip label={description} multiline maw={280} withArrow>
                <IconInfoCircle
                    size={16}
                    aria-label={description}
                    style={{ flexShrink: 0, opacity: 0.6, cursor: 'help' }}
                />
            </Tooltip>
        </Group>
    )
}

export default StatsCardTitle
