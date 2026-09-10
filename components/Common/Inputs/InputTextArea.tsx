import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { Textarea } from '@mantine/core'

interface InputTextAreaProps {
    required?: boolean
    flex?: number | string
    label: string
    placeholder?: string
    leftIcon?: ReactNode
    InputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const InputTextArea = (props: InputTextAreaProps) => {
    const { required, flex, label, placeholder, leftIcon, InputProps } = props

    return (
        <Textarea
            pt="1rem"
            required={required}
            flex={flex}
            withAsterisk={required}
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
