import { create } from 'zustand'

interface SelectedBusinessStoreState {
    selectedBusiness: number | null
    setSelectedBusiness: (businessID: number | null) => void
    initializeSelectedBusiness: (businessIDs: number[]) => void
}

const useSelectedBusinessStore = create<SelectedBusinessStoreState>((set) => ({
    selectedBusiness: null,
    setSelectedBusiness: (businessID) => set({ selectedBusiness: businessID }),
    initializeSelectedBusiness: (businessIDs) =>
        set((state) => ({
            selectedBusiness: state.selectedBusiness ?? businessIDs[0] ?? null,
        })),
}))

export default useSelectedBusinessStore
