import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, ApiError } from "@/context/AppContext";
import { REGIONS, STATE_NAME } from "@/constants/theme";
import SelectField from "@/components/SelectField";
import { requestLocationPermission } from "@/utils/location";

const PHONE_PREFIX = "+234";

const FIELDS = [
  { key: "name", label: "Full name", placeholder: "John Doe" },
  { key: "email", label: "Email address", placeholder: "you@example.com" },
  { key: "phone", label: "Phone number", placeholder: "800 000 0000" },
  { key: "password", label: "Password", placeholder: "Create a strong password", secure: true },
  { key: "confirm", label: "Confirm password", placeholder: "Re-enter your password", secure: true },
];

export default function Register() {
  const { register, setLocationEnabled } = useApp();
  const [accountType, setAccountType] = useState<"resident" | "chairman">("resident");
  const [values, setValues] = useState<Record<string, string>>({ phone: PHONE_PREFIX });
  const [region, setRegion] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enableLocation = async () => {
    const result = await requestLocationPermission();
    setLocationStatus(result.granted ? "granted" : "denied");
    setLocationEnabled(result.granted);
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setValues((prev) => ({ ...prev, phone: `${PHONE_PREFIX}${digits}` }));
  };

  const handleRegister = async () => {
    if (!values.name?.trim() || !values.email?.trim() || !values.password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (values.password !== values.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (values.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (accountType === "chairman" && !values.adminCode?.trim()) {
      setError("Enter the area chairman access code to register as a chairman.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const role = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim(),
        password: values.password,
        region: region ?? REGIONS[0],
        adminCode: accountType === "chairman" ? values.adminCode?.trim() : undefined,
      });
      if (accountType === "chairman" && role !== "admin") {
        // The code didn't match the backend's ADMIN_SIGNUP_CODE - the
        // account was still created, just as a resident, so don't silently
        // land them in the resident tabs looking like nothing happened.
        setError("That access code wasn't recognized. Your account was created as a resident - contact SafeGuard to be upgraded to area chairman.");
        setIsSubmitting(false);
        return;
      }
      router.replace(role === "admin" ? "/(admin)" : "/(resident)");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create your account. Please try again.");
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

          <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mb-5">
            {(
              [
                { key: "resident", label: "Resident" },
                { key: "chairman", label: "Area Chairman" },
              ] as const
            ).map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setAccountType(opt.key)}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  accountType === opt.key ? "bg-navy" : ""
                }`}
              >
                <Text
                  className={`font-body-semibold text-[13px] ${
                    accountType === opt.key ? "text-white" : "text-mist"
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {accountType === "chairman" && (
            <Text className="font-body text-mist text-[12px] mb-4 -mt-2">
              Area chairmen can review reports from residents in their area and
              mark them Active, Responding, or Resolved. You'll need an access
              code from SafeGuard to register as one.
            </Text>
          )}

          {FIELDS.slice(0, 3).map((f) => {
            const isPhoneField = f.key === "phone";
            return (
              <View key={f.key} className="mb-4">
                <Text className="font-body-medium text-ink text-[13px] mb-1.5">
                  {f.label}
                </Text>
                {isPhoneField ? (
                  <View className="flex-row items-center bg-card border border-hairline rounded-xl px-3 py-3.5">
                    <Text className="font-body text-ink mr-2">{PHONE_PREFIX}</Text>
                    <TextInput
                      value={values.phone?.replace(PHONE_PREFIX, "") ?? ""}
                      onChangeText={handlePhoneChange}
                      placeholder={f.placeholder}
                      placeholderTextColor="#9A9CA5"
                      keyboardType="number-pad"
                      inputMode="numeric"
                      autoCapitalize="none"
                      maxLength={10}
                      className="flex-1 font-body text-ink"
                    />
                  </View>
                ) : (
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
                )}
              </View>
            );
          })}

          <View className="mb-2">
            <SelectField
              label={accountType === "chairman" ? "Coverage area" : "Your area (Jos, Plateau State)"}
              value={region}
              options={REGIONS}
              placeholder="Select your area"
              onChange={setRegion}
            />
          </View>
          <Text className="font-body text-mist text-[12px] mb-4">
            {accountType === "chairman"
              ? "The area you'll be reviewing reports for. SafeGuard currently covers Jos, Plateau State only."
              : "This connects you with reports and responders near you. SafeGuard currently covers Jos, Plateau State only."}
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

          {FIELDS.slice(3).map((f) => {
            const isPasswordVisible = f.key === "password" ? showPassword : showConfirmPassword;
            const isSecureField = Boolean(f.secure);

            return (
              <View key={f.key} className="mb-4">
                <Text className="font-body-medium text-ink text-[13px] mb-1.5">
                  {f.label}
                </Text>
                <View className="flex-row items-center bg-card border border-hairline rounded-xl px-3">
                  <TextInput
                    value={values[f.key] ?? ""}
                    onChangeText={(t) =>
                      setValues((prev) => ({ ...prev, [f.key]: t }))
                    }
                    placeholder={f.placeholder}
                    placeholderTextColor="#9A9CA5"
                    secureTextEntry={isSecureField && !isPasswordVisible}
                    autoCapitalize="none"
                    className="flex-1 py-3.5 pr-2 font-body text-ink"
                  />
                  {isSecureField && (
                    <Pressable
                      onPress={() =>
                        f.key === "password"
                          ? setShowPassword((prev) => !prev)
                          : setShowConfirmPassword((prev) => !prev)
                      }
                      className="p-2"
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color="#667085"
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          {accountType === "chairman" && (
            <View className="mb-4">
              <Text className="font-body-medium text-ink text-[13px] mb-1.5">
                Area chairman access code
              </Text>
              <TextInput
                value={values.adminCode ?? ""}
                onChangeText={(t) =>
                  setValues((prev) => ({ ...prev, adminCode: t }))
                }
                placeholder="Provided by SafeGuard"
                placeholderTextColor="#9A9CA5"
                keyboardType="number-pad"
                inputMode="numeric"
                autoCapitalize="none"
                secureTextEntry
                className="bg-card border border-hairline rounded-xl px-4 py-3.5 font-body text-ink"
              />
            </View>
          )}

          {error && (
            <View className="bg-coral-light rounded-xl px-4 py-3 mb-4">
              <Text className="font-body-medium text-coral text-[13px]">{error}</Text>
            </View>
          )}

          <Pressable
            onPress={handleRegister}
            disabled={isSubmitting}
            className={`bg-navy rounded-2xl py-4 items-center mt-2 ${isSubmitting ? "opacity-70" : ""}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-body-semibold text-white text-[15px]">
                Register
              </Text>
            )}
          </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
