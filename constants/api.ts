import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Base URL for the SafeGuard backend (see the sibling SafeGuard-App-Backend
 * repo). Resolution order:
 *   1. `EXPO_PUBLIC_API_URL` env var (set this for a real device / staging /
 *      production backend, e.g. `EXPO_PUBLIC_API_URL=https://api.safeguard.app`).
 *   2. A same-network guess for local dev:
 *        - Web / iOS simulator: http://localhost:4000
 *        - Android emulator: http://10.0.2.2:4000 (its alias for the host machine)
 *      A physical device on Expo Go needs EXPO_PUBLIC_API_URL set explicitly
 *      to your machine's LAN IP (e.g. http://192.168.1.23:4000) since
 *      "localhost" on-device means the device itself, not your computer.
 */
function resolveApiUrl(): string {
  const fromExtra = Constants.expoConfig?.extra?.apiUrl ?? Constants.manifest2?.extra?.apiUrl;
  const fromEnv = process.env.EXPO_PUBLIC_API_URL ?? fromExtra;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }
  return "http://localhost:4000";
}

export const API_URL = resolveApiUrl();

// Surfaced once at startup so a misconfigured API_URL is obvious in logs
// rather than showing up as a silent network failure on every screen.
if (__DEV__) {
  console.log(`[SafeGuard] API_URL = ${API_URL}`);
}

export const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
