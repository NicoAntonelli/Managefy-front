import { NumberInputProps } from '@mantine/core'

type NumberInputPropsSimple = Omit<
    NumberInputProps,
    'label' | 'placeholder' | 'onChange'
> & {
    onChange?: (value: string | number | null) => void
}

export default NumberInputPropsSimple
