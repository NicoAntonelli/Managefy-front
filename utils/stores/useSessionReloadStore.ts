import { create } from 'zustand'

interface SessionReloadStoreState {
    needReload: boolean
    toggle: () => void
    setNeedReload: (value: boolean) => void
}

const useSessionReloadStore = create<SessionReloadStoreState>((set) => ({
    needReload: false,
    toggle: () => set((state) => ({ needReload: !state.needReload })),
    setNeedReload: (value: boolean) => set({ needReload: value }),
}))

export default useSessionReloadStore
