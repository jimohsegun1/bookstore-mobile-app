import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

    const { user, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (segments[0] === "(auth)" && user) {
            router.replace("/(tabs)");
        } else if (segments[0] === "(tabs)" && !user) {
            router.replace("/(auth)");
        }
    }, [segments, user]);

    return (
        <SafeAreaProvider>
            <SafeScreen>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </SafeScreen>
            <StatusBar style="dark" />
        </SafeAreaProvider>
    );
}
