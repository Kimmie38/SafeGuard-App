import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, ApiError, Role } from "@/context/AppContext";
import { requestLocationPermission } from "@/utils/location";

export default function Login() {
  const { login, setLocationEnabled } = useApp();
  const [portal, setPortal] = useState<Role>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "granted" | "denied"
  >("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enableLocation = async () => {
    const result = await requestLocationPermission();
    setLocationStatus(result.granted ? "granted" : "denied");
    setLocationEnabled(result.granted);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const actualRole = await login(email.trim(), password);
      if (actualRole !== portal) {
        // Be honest rather than silently overriding their choice: their
        // account's real role wins (a login tab can't grant permissions),
        // but say so instead of just teleporting them somewhere unexpected.
        Alert.alert(
          "Signed in",
          `This account is registered as ${actualRole === "admin" ? "an area chairman" : "a resident"} — taking you there.`
        );
      }
      router.replace(actualRole === "admin" ? "/(admin)" : "/(resident)");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
        enableOnAndroid
        extraScrollHeight={28}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
          <View className="mt-8 mb-6">
            <Image
              source={require("@/assets/Logo.png")}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>

          <Text className="font-display-bold text-2xl text-navy mb-1">
            Welcome back
          </Text>
          <Text className="font-body text-mist text-[14px] mb-6">
            Sign in to continue to SafeGuard
          </Text>

          <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mb-5">
            {(
              [
                { key: "resident" as Role, label: "Resident" },
                { key: "admin" as Role, label: "Admin" },
              ]
            ).map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setPortal(opt.key)}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  portal === opt.key ? "bg-navy" : ""
                }`}
              >
                <Text
                  className={`font-body-semibold text-[13px] ${
                    portal === opt.key ? "text-white" : "text-mist"
                  }`}
                >
                  {opt.label}
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
          <View className="flex-row items-center bg-card border border-hairline rounded-xl px-3 mb-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9A9CA5"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              className="flex-1 py-3.5 pr-2 font-body text-ink"
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              className="p-2"
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#667085"
              />
            </Pressable>
          </View>

          {error && (
            <View className="bg-coral-light rounded-xl px-4 py-3 mb-4">
              <Text className="font-body-medium text-coral text-[13px]">{error}</Text>
            </View>
          )}

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
                ? "Location permission denied — your account's registered area is still used"
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
            disabled={isSubmitting}
            className={`bg-navy rounded-2xl py-4 items-center mb-5 ${isSubmitting ? "opacity-70" : ""}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-body-semibold text-white text-[15px]">
                Log in as {portal === "admin" ? "admin" : "resident"}
              </Text>
            )}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
