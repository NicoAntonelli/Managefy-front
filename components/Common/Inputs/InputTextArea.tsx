import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { Textarea } from '@mantine/core'
import Constant from '@/utils/validation/Constant'

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
            withAsterisk={required}
            maxLength={Constant.MAX_STRING_SIZE_DESCRIPTION}
            flex={flex}
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
