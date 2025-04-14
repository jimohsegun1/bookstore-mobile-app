import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { create } from "zustand";

// res.status(200).json({
//     books,
//     currentPage: page,
//     totalBooks,
//     totalPages,
// });

export const useBookStore = create((set) => ({
    books: [],
    currentPage: 1,
    totalBooks: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    fetchBooks: async () => {
        set({ isLoading: true });
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/books`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                set({
                    books: data.books,
                    currentPage: data.currentPage,
                    totalBooks: data.totalBooks,
                    totalPages: data.totalPages,
                    isLoading: false,
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

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
