import { create } from 'zustand'

interface SessionReloadStoreState {
    reloadKey: number
    requestReload: () => void
}

const useSessionReloadStore = create<SessionReloadStoreState>((set) => ({
    reloadKey: 0,
    requestReload: () => set((state) => ({ reloadKey: state.reloadKey + 1 })),
}))

export default useSessionReloadStore
