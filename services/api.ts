import axios from 'axios'

import useNotificationsReloadStore from '@/hooks/stores/useNotificationsReloadStore'

const api = axios.create({
    withCredentials: true,
    timeout: 10000,
})

// Requests that change data may generate new notifications in the backend
const mutatingMethods = ['post', 'put', 'patch', 'delete']

// Refresh notifications after successful mutating requests (excluding the notifications endpoints)
api.interceptors.response.use((response) => {
    const method = response.config.method?.toLowerCase() ?? ''
    const url = response.config.url ?? ''

    if (mutatingMethods.includes(method) && !url.includes('/notifications')) {
        useNotificationsReloadStore.getState().requestReload()
    }

    return response
})

export default api
