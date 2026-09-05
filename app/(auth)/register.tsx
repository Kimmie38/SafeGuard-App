import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { REGIONS, STATE_NAME } from "@/constants/theme";
import SelectField from "@/components/SelectField";
import { requestLocationPermission } from "@/utils/location";

const FIELDS = [
  { key: "name", label: "Full name", placeholder: "John Doe" },
  { key: "email", label: "Email address", placeholder: "you@example.com" },
  { key: "phone", label: "Phone number", placeholder: "+234 800 000 0000" },
  { key: "password", label: "Password", placeholder: "Create a strong password", secure: true },
  { key: "confirm", label: "Confirm password", placeholder: "Re-enter your password", secure: true },
];

export default function Register() {
  const { login, setLocationEnabled } = useApp();
  const [values, setValues] = useState<Record<string, string>>({});
  const [region, setRegion] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied">("idle");

  const enableLocation = async () => {
    const result = await requestLocationPermission();
    setLocationStatus(result.granted ? "granted" : "denied");
    setLocationEnabled(result.granted);
  };

  const handleRegister = () => {
    login("resident", values.name || "John Doe", region ?? REGIONS[0]);
    router.replace("/(resident)");
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <Pressable
            onPress={() => router.back()}
            className="mt-4 mb-4 w-9 h-9 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#1B1B1D" />
          </Pressable>

          <Text className="font-display-bold text-2xl text-navy mb-1">
            Create account
          </Text>
          <Text className="font-body text-mist text-[14px] mb-6">
            Join SafeGuard to report and stay informed across {STATE_NAME}
          </Text>

          {FIELDS.slice(0, 3).map((f) => (
            <View key={f.key} className="mb-4">
              <Text className="font-body-medium text-ink text-[13px] mb-1.5">
                {f.label}
              </Text>
              <TextInput
                value={values[f.key] ?? ""}
                onChangeText={(t) =>
                  setValues((prev) => ({ ...prev, [f.key]: t }))
                }
                placeholder={f.placeholder}
                placeholderTextColor="#9A9CA5"
                autoCapitalize="none"
                className="bg-card border border-hairline rounded-xl px-4 py-3.5 font-body text-ink"
              />
            </View>
          ))}

          <View className="mb-2">
            <SelectField
              label="Your area (Jos, Plateau State)"
              value={region}
              options={REGIONS}
              placeholder="Select your area"
              onChange={setRegion}
            />
          </View>
          <Text className="font-body text-mist text-[12px] mb-4">
            This connects you with reports and responders near you. SafeGuard
            currently covers Jos, Plateau State only.
          </Text>

          <Pressable
            onPress={enableLocation}
            className="flex-row items-center gap-2 mb-5"
          >
            <Ionicons
              name={locationStatus === "granted" ? "checkmark-circle" : "location-outline"}
              size={16}
              color={locationStatus === "granted" ? "#0F6E56" : "#9A9CA5"}
            />
            <Text className="font-body-medium text-[13px] text-mist">
              {locationStatus === "granted"
                ? "Location enabled"
                : locationStatus === "denied"
                ? "Location permission denied — your selected area above is still used"
                : "Enable location (optional)"}
            </Text>
          </Pressable>

          {FIELDS.slice(3).map((f) => (
            <View key={f.key} className="mb-4">
              <Text className="font-body-medium text-ink text-[13px] mb-1.5">
                {f.label}
              </Text>
              <TextInput
                value={values[f.key] ?? ""}
                onChangeText={(t) =>
                  setValues((prev) => ({ ...prev, [f.key]: t }))
                }
                placeholder={f.placeholder}
                placeholderTextColor="#9A9CA5"
                secureTextEntry={f.secure}
                autoCapitalize="none"
                className="bg-card border border-hairline rounded-xl px-4 py-3.5 font-body text-ink"
              />
            </View>
          ))}

          <Pressable
            onPress={handleRegister}
            className="bg-navy rounded-2xl py-4 items-center mt-2"
          >
            <Text className="font-body-semibold text-white text-[15px]">
              Register
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
