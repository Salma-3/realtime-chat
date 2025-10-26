import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false, 
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem('soundEnabled')) === true,

    toggleSound: () => {
        let tmp = !get().isSoundEnabled;
        localStorage.setItem('soundEnabled', tmp)
        set({ isSoundEnabled: tmp })
    },

    setActiveTab: (tab) => set({ activeTab: tab}),
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    
    getAllContacts: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('/messages/contacts');
            set({ allContacts: res.data });
        } catch (error) {
            console.error('error in getAllContacts:', error);
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/messages/chats')
            set({ chats: res.data });
        } catch (error) {
            console.error('error in getMyChatPartners', error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false })
        }
    }
}))