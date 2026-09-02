import { create } from 'zustand'

import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'

interface SelectedBusinessStoreState {
    selectedBusiness: BusinessMinInfo | null
    setSelectedBusiness: (business: BusinessMinInfo | null) => void
    initializeSelectedBusiness: (businesses: BusinessMinInfo[]) => void
}

const useSelectedBusinessStore = create<SelectedBusinessStoreState>((set) => ({
    selectedBusiness: null,
    setSelectedBusiness: (business) => set({ selectedBusiness: business }),
    initializeSelectedBusiness: (businesses) =>
        set((state) => ({
            selectedBusiness:
                state.selectedBusiness ?? businesses[0] ?? null,
        })),
}))

export default useSelectedBusinessStore
