import { create } from "zustand";

interface User {
    guid: string;
    nickname: string;
    avatar?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,

    fetchUser: async () => {
        try {
            if (get().user) return;
            set({ loading: true, error: null });

            const res = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include",
            });

            if (!res.ok) {
                if (res.status !== 401) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Error fetching User");
                }
                set({ user: null, isAuthenticated: false, loading: false });
                return;
            }

            const data = await res.json();
            set({ user: data.user, isAuthenticated: true, loading: false });
        } catch (err: any) {
            console.error("Error fetching User:", err);
            set({ error: err.message, user: null, isAuthenticated: false, loading: false });
        }
    },

    logout: async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Error on LogOut:", err);
        } finally {
            set({ user: null, isAuthenticated: false });
        }
    },
}));