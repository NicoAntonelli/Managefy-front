import { create } from 'zustand'

interface NotificationsReloadStoreState {
    reloadKey: number
    requestReload: () => void
}

const useNotificationsReloadStore = create<NotificationsReloadStoreState>(
    (set) => ({
        reloadKey: 0,
        requestReload: () =>
            set((state) => ({ reloadKey: state.reloadKey + 1 })),
    })
)

export default useNotificationsReloadStore
