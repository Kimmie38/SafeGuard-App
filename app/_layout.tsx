import "../global.css";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { AppProvider, useApp } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

/**
 * Redirects a restored session (saved JWT, see AppContext's bootstrap
 * effect) straight past onboarding/login into the right area, instead of
 * making an already-authenticated person log in again every launch.
 */
function SessionGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping, role } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBootstrapping) return;
    const inAuthGroup = segments[0] === "(auth)";
    const atOnboarding = segments.length === 0 || (segments[0] as string) === "index";

    if (isAuthenticated && (inAuthGroup || atOnboarding)) {
      router.replace(role === "admin" ? "/(admin)" : "/(resident)");
    }
  }, [isAuthenticated, isBootstrapping, role, segments, router]);

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator size="large" color="#14213D" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <SessionGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(resident)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="incident/[id]" options={{ presentation: "card" }} />
          <Stack.Screen name="report/[id]" options={{ presentation: "card" }} />
        </Stack>
      </SessionGate>
    </AppProvider>
  );
}
