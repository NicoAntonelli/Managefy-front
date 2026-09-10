import type { TextareaHTMLAttributes } from 'react'
import { IconBook } from '@tabler/icons-react'

import InputTextArea from './InputTextArea'

interface InputDescriptionProps {
    withAsterisk?: boolean
    placeholder?: string
    InputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const InputDescription = (props: InputDescriptionProps) => {
    const { withAsterisk, placeholder, InputProps } = props

    return (
        <InputTextArea
            withAsterisk={withAsterisk}
            label="Descripción"
            placeholder={placeholder}
            leftIcon={<IconBook />}
            InputProps={InputProps}
        />
    )
}

export default InputDescription
