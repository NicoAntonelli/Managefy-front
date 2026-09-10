import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { Textarea } from '@mantine/core'

interface InputTextAreaProps {
    withAsterisk?: boolean
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    InputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const InputTextArea = (props: InputTextAreaProps) => {
    const { withAsterisk, label, placeholder, leftIcon, InputProps } = props

    return (
        <Textarea
            pt="1rem"
            withAsterisk={withAsterisk}
            label={label}
            placeholder={placeholder}
            autosize
            minRows={3}
            leftSection={leftIcon}
            styles={{
                section: {
                    alignItems: 'flex-start',
                    paddingTop: '0.2rem',
                },
            }}
            {...InputProps}
        />
    )
}

export default InputTextArea
