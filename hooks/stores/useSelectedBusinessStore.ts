import { create } from 'zustand'

import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'

interface SelectedBusinessStoreState {
    selectedBusiness: BusinessMinInfo | null
    setSelectedBusiness: (business: BusinessMinInfo | null) => void
    syncSelectedBusiness: (businesses: BusinessMinInfo[]) => void
}

const useSelectedBusinessStore = create<SelectedBusinessStoreState>((set) => ({
    selectedBusiness: null,
    setSelectedBusiness: (business) => set({ selectedBusiness: business }),
    // Syncs the selection with the user's current businesses (also detects if the user lost his role or business deletion)
    syncSelectedBusiness: (businesses) =>
        set((state) => {
            const selectedID = state.selectedBusiness?.id
            const stillParticipates = businesses.find(
                (business) => business.id === selectedID
            )

            return {
                selectedBusiness: stillParticipates ?? businesses[0] ?? null,
            }
        }),
}))

export default useSelectedBusinessStore
