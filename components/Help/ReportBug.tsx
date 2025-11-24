import React from 'react'
import {
    Anchor,
    Badge,
    Button,
    Card,
    Flex,
    Group,
    Image,
    Stack,
    Text,
    TextInput,
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
        return `[Name: ${values.name}]${newLine}[Email: ${values.email}]${newLine}${newLine}${values.message}`
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
            withBorder
            className="min-w-full">
            <Card.Section p="1rem">
                <Flex justify="flex-start" align="center" gap="2rem">
                    <Image
                        src="/olivia_hunts_bugs.png"
                        h={isMobile ? '300' : '450'}
                        w="auto"
                        alt="Bug report with Olivia"
                        p="rem"
                        radius="md"
                    />
                    <Stack>
                        <Text size="2rem">
                            Reportar bug a{' '}
                            <Anchor
                                href={`mailto:${Env.contactMail}`}
                                target="_blank"
                                underline="hover"
                                c="orange.6">
                                {Env.contactMail}
                            </Anchor>
                        </Text>

                        <form
                            onSubmit={form.onSubmit((values) =>
                                handleSubmit(values)
                            )}>
                            <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
                                <IconUser size={'2rem'} />
                                <TextInput
                                    flex={1}
                                    label="Nombre"
                                    placeholder="John Doe"
                                    required
                                    {...form.getInputProps('name')}
                                />
                            </Flex>
                            <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
                                <IconMail size={'2rem'} />
                                <TextInput
                                    flex={1}
                                    label="Email"
                                    placeholder="johndoe@mail.com"
                                    required
                                    {...form.getInputProps('email')}
                                />
                            </Flex>
                            <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
                                <IconInfoSquareRounded size={'2rem'} />
                                <TextInput
                                    flex={1}
                                    label="Asunto"
                                    placeholder="Me llegan demasiadas notificaciones"
                                    required
                                    {...form.getInputProps('subject')}
                                />
                            </Flex>
                            <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
                                <IconAlignBoxLeftBottom size={'2rem'} />
                                <TextInput
                                    flex={1}
                                    label="Mensaje"
                                    placeholder="Las notificaciones son muy molestas!"
                                    required
                                    {...form.getInputProps('message')}
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
