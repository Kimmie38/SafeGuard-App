import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, Role } from "@/context/AppContext";
import { REGIONS } from "@/constants/theme";
import SelectField from "@/components/SelectField";
import { requestLocationPermission } from "@/utils/location";

export default function Login() {
  const { login, setLocationEnabled } = useApp();
  const [role, setRole] = useState<Role>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "granted" | "denied"
  >("idle");

  const enableLocation = async () => {
    const result = await requestLocationPermission();
    setLocationStatus(result.granted ? "granted" : "denied");
    setLocationEnabled(result.granted);
  };

  const handleLogin = () => {
    login(role, role === "admin" ? "Officer Johnson" : "John Doe", region);
    router.replace(role === "admin" ? "/(admin)" : "/(resident)");
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="w-14 h-14 rounded-2xl bg-navy items-center justify-center mt-8 mb-6">
            <Ionicons name="shield-checkmark" size={26} color="#F2A93B" />
          </View>

          <Text className="font-display-bold text-2xl text-navy mb-1">
            Welcome back
          </Text>
          <Text className="font-body text-mist text-[14px] mb-6">
            Sign in to continue to SafeGuard
          </Text>

          {/* role toggle */}
          <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mb-5">
            {(["resident", "admin"] as Role[]).map((r) => (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  role === r ? "bg-navy" : ""
                }`}
              >
                <Text
                  className={`font-body-semibold text-[13px] capitalize ${
                    role === r ? "text-white" : "text-mist"
                  }`}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-ink text-[13px] mb-1.5">
            Email address
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9A9CA5"
            autoCapitalize="none"
            className="bg-card border border-hairline rounded-xl px-4 py-3.5 mb-4 font-body text-ink"
          />

          <Text className="font-body-medium text-ink text-[13px] mb-1.5">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9A9CA5"
            secureTextEntry
            className="bg-card border border-hairline rounded-xl px-4 py-3.5 mb-4 font-body text-ink"
          />

          <View className="mb-2">
            <SelectField
              label={role === "admin" ? "Coverage area" : "Your area"}
              value={region}
              options={REGIONS}
              onChange={setRegion}
            />
          </View>

          <Pressable
            onPress={enableLocation}
            className="flex-row items-center gap-2 mb-6"
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
                ? "Location permission denied — you can still pick your area above"
                : "Enable location to connect with nearby reports"}
            </Text>
          </Pressable>

          <Pressable className="self-end mb-4">
            <Text className="font-body-medium text-navy text-[13px]">
              Forgot password?
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogin}
            className="bg-navy rounded-2xl py-4 items-center mb-5"
          >
            <Text className="font-body-semibold text-white text-[15px]">
              Log in as {role === "admin" ? "admin" : "resident"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mb-8">
            <Text className="font-body text-mist text-[13px]">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="font-body-semibold text-navy text-[13px]">
                Register
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
