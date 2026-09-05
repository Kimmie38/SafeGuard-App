import * as Location from "expo-location";

export type LocationPermissionResult = {
  granted: boolean;
  coords?: { latitude: number; longitude: number };
};

/**
 * Requests foreground location permission and, if granted, the current
 * position. SafeGuard does not do live reverse-geocoding against the
 * region list below — the person still confirms their area manually.
 * This keeps "connect users by location" honest in a frontend-only,
 * no-backend build rather than faking a precision it doesn't have.
 */
export async function requestLocationPermission(): Promise<LocationPermissionResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { granted: false };
    }
    const position = await Location.getCurrentPositionAsync({});
    return {
      granted: true,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch {
    return { granted: false };
  }
}
