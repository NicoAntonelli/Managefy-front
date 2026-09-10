import React from 'react'
import {
    Anchor,
    Button,
    Card,
    Flex,
    Image,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
    IconAlignBoxLeftBottom,
    IconInfoSquareRounded,
    IconMail,
    IconUser,
} from '@tabler/icons-react'

import Env from '@/utils/Env'
import Theme from '@/app/theme'

import InputText from '@/components/Common/Inputs/InputText'
import InputTextArea from '@/components/Common/Inputs/InputTextArea'

const ReportBug = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    // Report form inputs
    type ReportInputs = {
        name: string
        email: string
        subject: string
        message: string
    }

    // Format mail body
    const bodyFormat = (values: ReportInputs) => {
        const newLine = '%0D%0A'
        return `[Nombre: ${values.name}]${newLine}[Email: ${values.email}]${newLine}${newLine}${values.message}`
    }

    const handleSubmit = (values: ReportInputs) => {
        window.location.href = `mailto:${Env.contactMail}?subject=[MANAGEFY] ${
            values.subject
        }&body=${bodyFormat(values)}`
    }

    const form = useForm<ReportInputs>({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    })

    return (
        <Card
            id="reportBug"
            shadow="sm"
            padding="lg"
            radius="md"
            mb="3rem"
            withBorder
            className="min-w-full">
            <Card.Section p="1rem">
                <Flex justify="flex-start" align="center" gap="2rem">
                    <Image
                        src="/olivia_hunts_bugs.png"
                        h={isMobile ? '400' : '580'}
                        w="auto"
                        mt={isMobile ? '4rem' : '0rem'}
                        alt="Reporte de errores con Olivia"
                        radius="md"
                    />
                    <Stack>
                        <Title size="2rem">Reportar bug</Title>
                        <Text size={isMobile ? '1.2rem' : '2rem'}>
                            Reporta un bug a{' '}
                            <Anchor
                                href={`mailto:${Env.contactMail}`}
                                target="_blank"
                                underline="hover"
                                c={Theme.other!.secondaryColor}>
                                {Env.contactMail}
                            </Anchor>
                        </Text>

                        <form
                            onSubmit={form.onSubmit((values) =>
                                handleSubmit(values)
                            )}>
                            <Flex align="flex-start" mt="1rem" gap="1rem">
                                <IconUser
                                    size="2rem"
                                    style={{ marginTop: '1.5rem' }}
                                />
                                <InputText
                                    flex={1}
                                    label="Nombre"
                                    placeholder="John Doe"
                                    required
                                    InputProps={{
                                        ...form.getInputProps('name'),
                                    }}
                                />
                            </Flex>
                            <Flex align="flex-start" mt="1rem" gap="1rem">
                                <IconMail
                                    size="2rem"
                                    style={{ marginTop: '1.5rem' }}
                                />
                                <InputText
                                    flex={1}
                                    label="Email"
                                    placeholder="johndoe@mail.com"
                                    required
                                    InputProps={{
                                        ...form.getInputProps('email'),
                                        type: 'email',
                                    }}
                                />
                            </Flex>
                            <Flex align="flex-start" mt="1rem" gap="1rem">
                                <IconInfoSquareRounded
                                    size="2rem"
                                    style={{ marginTop: '1.5rem' }}
                                />
                                <InputText
                                    flex={1}
                                    label="Asunto"
                                    placeholder="Me llegan demasiadas notificaciones"
                                    required
                                    InputProps={{
                                        ...form.getInputProps('subject'),
                                    }}
                                />
                            </Flex>
                            <Flex align="flex-start" mt="1rem" gap="1rem">
                                <IconAlignBoxLeftBottom
                                    size="2rem"
                                    style={{ marginTop: '1.5rem' }}
                                />
                                <InputTextArea
                                    flex={1}
                                    label="Mensaje"
                                    placeholder="Las notificaciones son muy molestas!"
                                    required
                                    InputProps={{
                                        ...form.getInputProps('message'),
                                    }}
                                />
                            </Flex>

                            <Button type="submit" mt="xl" radius="md" fullWidth>
                                Reportar bug
                            </Button>
                        </form>
                    </Stack>
                </Flex>
            </Card.Section>
        </Card>
    )
}

export default ReportBug
