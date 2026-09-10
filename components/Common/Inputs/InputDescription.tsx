import type { TextareaHTMLAttributes } from 'react'
import { IconBook } from '@tabler/icons-react'

import InputTextArea from './InputTextArea'

interface InputDescriptionProps {
    required?: boolean
    placeholder?: string
    InputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const InputDescription = (props: InputDescriptionProps) => {
    const { required, placeholder, InputProps } = props

    return (
        <InputTextArea
            required={required}
            label="Descripción"
            placeholder={placeholder}
            leftIcon={<IconBook />}
            InputProps={InputProps}
        />
    )
}

export default InputDescription
