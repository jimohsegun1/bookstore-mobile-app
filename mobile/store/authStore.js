import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    register: async (userData) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                set({ user: data.user, token: data.token, isLoading: false });
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                await AsyncStorage.setItem("token", data.token);
            } else {
                throw new Error(data.message);
            }

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                set({ user: data.user, token: data.token, isLoading: false });
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                await AsyncStorage.setItem("token", data.token);
            } else {
                throw new Error(data.message);
            }

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    checkAuth: async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");
            if (storedUser && storedToken) {
                set({ user: JSON.parse(storedUser), token: storedToken });
            }
        } catch (error) {
            console.error("Error checking auth", error);
        }
    },

    logout: async () => {
        set({ user: null, token: null });
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
    },
}));
