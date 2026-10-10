import axios from 'axios'

import useNotificationsReloadStore from '@/hooks/stores/useNotificationsReloadStore'

const api = axios.create({
    withCredentials: true,
    timeout: 10000,
})

// Requests that change data may generate new notifications in the backend
const mutatingMethods = ['post', 'put', 'patch', 'delete']

// Endpoints that never generate notifications:
// - notifications: they update the list locally
// - session: logging out would fetch the notifications without a token
// - errorLogs: a failed notifications fetch is logged, so it would loop
const excludedEndpoints = ['/notifications', '/api/session', '/errorLogs']

// Refresh notifications after successful mutating requests
api.interceptors.response.use((response) => {
    const method = response.config.method?.toLowerCase() ?? ''
    const url = response.config.url ?? ''

    const isExcluded = excludedEndpoints.some((endpoint) =>
        url.includes(endpoint)
    )

    if (mutatingMethods.includes(method) && !isExcluded) {
        useNotificationsReloadStore.getState().requestReload()
    }

    return response
})

export default api
