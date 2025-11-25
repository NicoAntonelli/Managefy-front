import React from 'react'
import { Anchor, Card, Group, Image, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from '@/app/theme'
import Env from '@/utils/Env'

const TermsConditions = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    return (
        <Card
            id="termsConditions"
            shadow="sm"
            padding="lg"
            radius="md"
            mt="3rem"
            withBorder
            className="min-w-full">
            <Card.Section p="1rem">
                <Group justify="flex-start" gap={isMobile ? '1rem' : '2rem'}>
                    <Image
                        src="/Managefy-logo.jpeg"
                        alt="Managefy logo"
                        h={isMobile ? 150 : 350}
                        w="auto"
                        radius="md"
                    />
                    <Stack gap="0.25rem">
                        <Text size={isMobile ? '2rem' : '4rem'}>Managefy</Text>
                        <Text size={isMobile ? '2rem' : '4rem'}>
                            Términos y Condiciones de Uso
                        </Text>
                        <Text
                            size={isMobile ? '1rem' : '2rem'}
                            mt={isMobile ? '0.5rem' : '3rem'}>
                            Última actualización: <b>24/11/2025</b>
                        </Text>
                    </Stack>
                </Group>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="sm" c="dimmed">
                    Bienvenido/a a Managefy (&quot;la Aplicación&quot;), un
                    sistema de gestión de recursos (ERP) diseñado para pequeñas
                    empresas y emprendimientos.
                </Text>
                <Text size="sm" c="dimmed">
                    Al crear una cuenta, acceder o utilizar la Aplicación, usted
                    acepta estos Términos y Condiciones de Uso
                    (&quot;Términos&quot;).
                </Text>
                <Text size="sm" c="dimmed">
                    Si no está de acuerdo con ellos, no debe utilizar la
                    Aplicación.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">1. Objeto del Servicio</Text>
                <Text size="sm" c="dimmed">
                    Managefy permite a los usuarios:
                </Text>
                <Text size="sm" c="dimmed">
                    - Registrar y administrar una o varias empresas.
                </Text>
                <Text size="sm" c="dimmed">
                    - Registrar, editar y administrar productos.
                </Text>
                <Text size="sm" c="dimmed">
                    - Registrar, editar y administrar clientes y proveedores.
                </Text>
                <Text size="sm" c="dimmed">
                    - Registrar ventas y acceder a reportes relacionados.
                </Text>
                <Text size="sm" c="dimmed">
                    - Visualizar estadísticas, incluyendo productos más vendidos
                    o que mayor ingreso generaron.
                </Text>
                <Text size="sm" c="dimmed">
                    - Compartir la gestión del emprendimiento con otros usuarios
                    asignándoles roles como Manager o Colaborador.
                </Text>
                <Text size="sm" c="dimmed">
                    - Transferir el rol de Manager a otra persona usuaria.
                </Text>
                <Text size="sm" c="dimmed">
                    - Recibir notificaciones relacionadas con la actividad de la
                    cuenta.
                </Text>
                <Text size="sm" c="dimmed">
                    - Verificar su identidad mediante un código enviado por
                    correo electrónico al registrarse.
                </Text>
                <Text size="sm" c="dimmed">
                    Las funcionalidades podrán ampliarse o modificarse en el
                    futuro.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">2. Registro y Verificación de Cuenta</Text>
                <Text size="sm" c="dimmed">
                    Para utilizar la Aplicación, el usuario debe:
                </Text>
                <Text size="sm" c="dimmed">
                    1- Crear una cuenta proporcionando información real,
                    completa y actualizada.
                </Text>
                <Text size="sm" c="dimmed">
                    2- Verificar su dirección de correo electrónico mediante un
                    código enviado automáticamente.
                </Text>
                <Text size="sm" c="dimmed">
                    - El usuario es responsable de mantener la confidencialidad
                    de sus credenciales y de toda actividad realizada desde su
                    cuenta.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">3. Roles y Permisos</Text>
                <Text size="sm" c="dimmed">
                    La Aplicación permite invitar a otros usuarios a colaborar
                    en una empresa registrada.
                </Text>
                <Text size="sm" c="dimmed">
                    - Manager: posee control total sobre la empresa, sus datos y
                    configuraciones, incluyendo la facultad de transferir el rol
                    a otra persona.
                </Text>
                <Text size="sm" c="dimmed">
                    - Colaborador: posee permisos limitados según la
                    configuración establecida por el Manager.
                </Text>
                <Text size="sm" c="dimmed">
                    El usuario que invita a terceros es responsable de otorgar y
                    gestionar adecuadamente los permisos.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">4. Uso Aceptable</Text>
                <Text size="sm" c="dimmed">
                    El usuario se compromete a:
                </Text>
                <Text size="sm" c="dimmed">
                    - Utilizar la Aplicación solo para fines legales y
                    comerciales legítimos.
                </Text>
                <Text size="sm" c="dimmed">
                    - No realizar actividades fraudulentas, abusivas o que
                    puedan dañar la Aplicación, otros usuarios o terceros.
                </Text>
                <Text size="sm" c="dimmed">
                    - No intentar acceder de manera no autorizada a información
                    o cuentas de otros usuarios.
                </Text>
                <Text size="sm" c="dimmed">
                    - No interferir con el funcionamiento del servicio ni
                    intentar vulnerar medidas de seguridad.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">5. Contenido y Datos Ingresados</Text>
                <Text size="sm" c="dimmed">
                    Toda la información registrada por el usuario (datos de
                    empresas, productos, clientes, proveedores, ventas, etc.) es
                    de su exclusiva responsabilidad.
                </Text>
                <Text size="sm" c="dimmed">
                    Managefy no se hace responsable de la veracidad, exactitud o
                    legalidad de dichos datos.
                </Text>
                <Text size="sm" c="dimmed">
                    El usuario garantiza contar con los derechos para cargar
                    dicha información en la plataforma.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">6. Privacidad y Protección de Datos</Text>
                <Text size="sm" c="dimmed">
                    El tratamiento de la información personal se rige por
                    nuestra Política de Privacidad, que forma parte integral de
                    estos Términos. Entre otros aspectos, la Aplicación:
                </Text>
                <Text size="sm" c="dimmed">
                    Utiliza el correo electrónico del usuario únicamente para la
                    verificación de la cuenta, notificaciones y comunicaciones
                    relevantes para la prestación del servicio.
                </Text>
                <Text size="sm" c="dimmed">
                    Nunca comparte datos personales con terceros sin
                    consentimiento, salvo obligación legal.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">7. Notificaciones</Text>
                <Text size="sm" c="dimmed">
                    El usuario podrá recibir notificaciones dentro de la
                    Aplicación, por correo electrónico o por otros medios
                    electrónicos.
                </Text>
                <Text size="sm" c="dimmed">
                    Estas notificaciones pueden incluir avisos sobre actividad
                    de la cuenta, invitaciones, reportes, recordatorios u otra
                    información relevante para el funcionamiento del servicio.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">8. Disponibilidad y Modificaciones</Text>
                <Text size="sm" c="dimmed">
                    La Aplicación se ofrece &quot;tal cual es&quot; y su
                    disponibilidad puede variar por razones técnicas, de
                    mantenimiento o mejora.
                </Text>
                <Text size="sm" c="dimmed">
                    Managefy se reserva el derecho de:
                </Text>
                <Text size="sm" c="dimmed">
                    - Modificar o actualizar los Términos.
                </Text>
                <Text size="sm" c="dimmed">
                    - Incorporar, modificar o eliminar funcionalidades.
                </Text>
                <Text size="sm" c="dimmed">
                    - Suspender temporal o permanentemente el servicio.
                </Text>
                <Text size="sm" c="dimmed">
                    Cualquier cambio relevante será comunicado a los usuarios.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">9. Responsabilidad</Text>
                <Text size="sm" c="dimmed">
                    Managefy no será responsable por:
                </Text>
                <Text size="sm" c="dimmed">
                    - Pérdidas de datos ocasionadas por fallas técnicas, errores
                    del usuario o acciones de terceros.
                </Text>
                <Text size="sm" c="dimmed">
                    - Pérdidas económicas derivadas de decisiones comerciales
                    tomadas por el usuario en base a la información cargada en
                    la Aplicación.
                </Text>
                <Text size="sm" c="dimmed">
                    - Daños indirectos, incidentales o consecuentes.
                </Text>
                <Text size="sm" c="dimmed">
                    El usuario utiliza la Aplicación bajo su propio riesgo.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">10. Propiedad Intelectual y Licencia</Text>
                <Text size="sm" c="dimmed">
                    Managefy es un proyecto open-source. El código fuente está
                    disponible públicamente en GitHub y puede ser utilizado,
                    modificado y distribuido libremente siempre que se respeten
                    los términos de la misma licencia libre bajo la cual el
                    proyecto es publicado.
                </Text>
                <Text size="sm" c="dimmed">
                    El usuario no podrá utilizar la marca &quot;Managefy&quot;,
                    su logo u otros elementos identificatorios con fines
                    comerciales sin la autorización correspondiente, pero sí
                    podrá utilizar, estudiar y adaptar el software conforme lo
                    establezca su licencia open-source.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">11. Suspensión o Cierre de Cuenta</Text>
                <Text size="sm" c="dimmed">
                    Podemos suspender o cancelar la cuenta de un usuario si:
                </Text>
                <Text size="sm" c="dimmed">
                    - Incumple estos Términos.
                </Text>
                <Text size="sm" c="dimmed">
                    - Realiza actividades sospechosas, fraudulentas o
                    perjudiciales.
                </Text>
                <Text size="sm" c="dimmed">
                    - Lo solicita el propio usuario.
                </Text>
                <Text size="sm" c="dimmed">
                    El usuario puede solicitar la eliminación permanente de su
                    cuenta mediante los mecanismos disponibles en la Aplicación.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">12. Legislación Aplicable</Text>
                <Text size="sm" c="dimmed">
                    Estos Términos se rigen por las leyes de Argentina, y
                    cualquier disputa relacionada será sometida a los tribunales
                    competentes de dicho país, salvo disposición legal en
                    contrario.
                </Text>
            </Card.Section>

            <Card.Section p="1rem">
                <Text size="lg">13. Contacto</Text>
                <Text size="sm" c="dimmed">
                    Para consultas o reclamos, el usuario puede contactarse a{' '}
                    <Anchor
                        href={`mailto:${Env.contactMail}`}
                        target="_blank"
                        underline="hover"
                        c="orange.6">
                        {Env.contactMail}
                    </Anchor>
                    .
                </Text>
            </Card.Section>
        </Card>
    )
}

export default TermsConditions
