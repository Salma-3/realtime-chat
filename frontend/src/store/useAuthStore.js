import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: { name: 'john', id: 12, age: 30},
    isLoggedIn: false,
    isLoading: false,
    login: () => {
        
        set({
           isLoggedIn: true
        })
    }
}))