import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { create } from "zustand";

export const useBookStore = create((set) => ({
    isLoading: false,
    error: null,

    addBook: async (bookData) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
}));
