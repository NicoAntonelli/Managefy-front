import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ActionIcon,
    Button,
    Card,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core'
import {
    IconClipboard,
    IconExternalLink,
    IconLink,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import TextHelper from '@/utils/string/TextHelper'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import Businesses from '@/services/businesses'
import Users from '@/services/users'

import Theme from '@/app/theme'

import BusinessCreateUpdate from '@/components/Businesses/BusinessCreateUpdate'
import BusinessDelete from '@/components/Businesses/BusinessDelete'
import BusinessDetailResourcesTabs from '@/components/Businesses/BusinessDetailResourcesTabs'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserRolesCompactTable from '@/components/UserRoles/UserRolesCompactTable'

import Business from '@/entities/businesses/Business'
import BusinessCU from '@/entities/businesses/BusinessCU'
import WeekDay from '@/entities/helpTypes/WeekDay'

const weekDayLabels: Record<WeekDay, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
}

interface BusinessDetailProps {
    findByLink?: boolean
}

const BusinessDetail = (props: BusinessDetailProps) => {
    const { findByLink } = props

    const router = useRouter()

    const params = useParams()
    const businessID = params?.id ? Number(params.id) : null
    const linkParam = params?.link

    // If the business is being accessed by link, use the link parameter
    const businessLink =
        typeof linkParam === 'string' ? linkParam : (linkParam?.[0] ?? null)

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )

    const [business, setBusiness] = useState<Business | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!businessID && !findByLink) {
            setLoading(false)
            return
        }

        const fetchBusiness = async () => {
            try {
                // Get by ID
                if (!findByLink) {
                    const businessData = await Businesses.getOneBusiness(
                        businessID!
                    )

                    setBusiness(businessData)
                    return
                }

                // Get by Link - If the user isn't logged in, we need to check public businesses only
                const userIsLogged = await Users.checkSession()

                const businessData = userIsLogged
                    ? await Businesses.getOneBusinessByLink(businessLink!)
                    : await Businesses.getOneBusinessByLinkPublic(businessLink!)
                setBusiness(businessData)
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar el emprendimiento',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchBusiness()
    }, [businessID, findByLink, businessLink])

    const handleEdit = () => {
        if (!business) return
        setEditing(true)
    }

    const copyToClipboard = (link: string) => async () => {
        const fullLink = `${window.location.origin}/businesses/link/${link}`

        await navigator.clipboard.writeText(fullLink)
        notifications.show({
            title: 'Éxito',
            message: 'Copiado al portapapeles',
            color: Theme.other!.success,
        })
    }

    const redirectToLink = (link: string) => {
        router.push(`/businesses/link/${link}`)
    }

    const activeDays = TextHelper.weekDaysComplete
        .filter((day) => business?.businessDays?.[day])
        .map((day) => weekDayLabels[day])

    if (loading) {
        return <SkeletonFull />
    }

    if (business && editing) {
        const businessCU: BusinessCU = {
            id: business.id,
            name: business.name,
            description: business.description,
            link: business.link,
            isPublic: business.isPublic,
            businessDays: business.businessDays,
        }

        return (
            <BusinessCreateUpdate
                currentBusiness={businessCU}
                backHref={`/businesses/${business.id}`}
                cancelHref={`/businesses/${business.id}`}
                onCancel={() => setEditing(false)}
                onSuccess={(updatedBusiness) => {
                    setBusiness({
                        ...updatedBusiness,
                        currentUserRole:
                            updatedBusiness.currentUserRole ??
                            business.currentUserRole,
                    })
                    if (selectedBusiness?.id === updatedBusiness.id) {
                        setSelectedBusiness({
                            id: updatedBusiness.id,
                            name: updatedBusiness.name,
                            isPublic: updatedBusiness.isPublic,
                            currentUserRole:
                                updatedBusiness.currentUserRole ??
                                selectedBusiness.currentUserRole,
                        })
                    }
                    setEditing(false)
                }}
            />
        )
    }

    if (!business) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                    <ButtonGoBack href="/businesses" text="emprendimientos" />
                </div>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="min-w-full">
                    <Text c="dimmed">Emprendimiento no encontrado</Text>
                </Card>
            </Stack>
        )
    }

    return (
        <Stack gap="xs" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <ButtonGoBack href="/businesses" text="emprendimientos" />
            </div>

            <div style={{ marginBottom: 'var(--mantine-spacing-sm)' }}>
                <ButtonCreate
                    href="/businesses/new"
                    resourceName="emprendimiento"
                />
            </div>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Stack gap="xs" mb="md">
                    <Title size="2rem" style={{ overflowWrap: 'anywhere' }}>
                        {business.name}
                    </Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Descripción
                        </Text>
                        <Text c={business.description ? undefined : 'dimmed'}>
                            {business.description || 'Sin asignar'}
                        </Text>
                    </div>
                </Stack>

                <Grid mb="lg">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Text size="sm" fw={500} c="dimmed">
                            Nivel de visibilidad
                        </Text>
                        <Text>
                            {TextHelper.getVisibilityText(business.isPublic)}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Text size="sm" fw={500} c="dimmed">
                            Tu rol en este emprendimiento
                        </Text>
                        <Text
                            c={business.currentUserRole ? undefined : 'dimmed'}>
                            {business.currentUserRole
                                ? TextHelper.getRoleText(
                                      business.currentUserRole
                                  )
                                : 'Sin asignar'}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Text size="sm" fw={500} c="dimmed">
                            Enlace
                        </Text>
                        <Group gap="xs" align="center" wrap="nowrap">
                            <IconLink size={18} />
                            <Text
                                size="lg"
                                style={{ overflowWrap: 'anywhere' }}
                                c={business.link ? undefined : 'dimmed'}>
                                {business.link || 'Sin asignar'}
                            </Text>
                            {business.link && (
                                <>
                                    <Tooltip label="Copiar link al portapapeles">
                                        <ActionIcon
                                            color={Theme.primaryColor}
                                            variant="outline"
                                            size="sm"
                                            aria-label="Copiar link al portapapeles"
                                            onClick={copyToClipboard(
                                                business.link
                                            )}>
                                            <IconClipboard size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    {!findByLink && (
                                        <Tooltip label="Visitar enlace">
                                            <ActionIcon
                                                color={
                                                    Theme.other!.secondaryColor
                                                }
                                                variant="outline"
                                                size="sm"
                                                aria-label="Visitar enlace"
                                                onClick={() =>
                                                    redirectToLink(
                                                        business.link
                                                    )
                                                }>
                                                <IconExternalLink size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </>
                            )}
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Text size="sm" fw={500} c="dimmed">
                            Días laborables
                        </Text>
                        <Text c={activeDays.length ? undefined : 'dimmed'}>
                            {activeDays.length
                                ? activeDays.join(', ')
                                : 'Sin asignar'}
                        </Text>
                    </Grid.Col>
                </Grid>

                <Group justify="flex-start" gap="sm" mt="xl">
                    <Button
                        color={Theme.primaryColor}
                        leftSection={<IconPencil size={20} />}
                        onClick={handleEdit}>
                        Editar
                    </Button>

                    <Button
                        color={Theme.other!.danger}
                        leftSection={<IconTrash size={20} />}
                        onClick={() => setDeleteModalOpened(true)}>
                        Eliminar
                    </Button>
                </Group>
            </Card>

            <UserRolesCompactTable businessID={business.id} />

            <BusinessDetailResourcesTabs businessID={business.id} />

            <BusinessDelete
                opened={deleteModalOpened}
                businessID={business.id}
                businessName={business.name}
                onClose={() => setDeleteModalOpened(false)}
            />
        </Stack>
    )
}

export default BusinessDetail
