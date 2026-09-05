import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";

const ROWS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accent: "amber" | "coral" | "teal" | "navy";
}[] = [
  { icon: "people-outline", label: "Response team", accent: "navy" },
  { icon: "stats-chart-outline", label: "Incident analytics", accent: "teal" },
  { icon: "map-outline", label: "Coverage area", accent: "amber" },
  { icon: "settings-outline", label: "System settings", accent: "navy" },
  { icon: "help-circle-outline", label: "Help & support", accent: "coral" },
];

const ROW_BG: Record<string, string> = {
  navy: "bg-navy/10",
  amber: "bg-amber/20",
  coral: "bg-coral-light",
  teal: "bg-teal-light",
};

const ROW_ICON: Record<string, string> = {
  navy: "#14213D",
  amber: "#8A5C15",
  coral: "#D8492F",
  teal: "#0F6E56",
};

export default function AdminProfile() {
  const { userName, userRegion, reports, logout } = useApp();

  const responding = reports.filter((r) => r.status === "Responding").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-navy pt-6 pb-16 px-6 rounded-b-[32px]">
          <Text className="font-display-bold text-2xl text-white mb-6">
            Admin profile
          </Text>
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-white/10 border-2 border-amber items-center justify-center mb-3">
              <Ionicons name="shield-checkmark" size={38} color="#F2A93B" />
            </View>
            <Text className="font-display text-[19px] text-white">
              {userName}
            </Text>
            <Text className="font-body text-white/60 text-[13px]">
              Security personnel • Covering {userRegion ?? "Jos"}
            </Text>
          </View>
        </View>

        <View className="px-6 -mt-10 mb-6">
          <View className="flex-row bg-card border border-hairline rounded-2xl overflow-hidden">
            <View className="flex-1 items-center py-4 border-r border-hairline">
              <Text className="font-display-bold text-xl text-navy">
                {reports.length}
              </Text>
              <Text className="font-body text-mist text-[12px] mt-0.5">
                Total cases
              </Text>
            </View>
            <View className="flex-1 items-center py-4 border-r border-hairline">
              <Text className="font-display-bold text-xl text-amber-dark">
                {responding}
              </Text>
              <Text className="font-body text-mist text-[12px] mt-0.5">
                Responding
              </Text>
            </View>
            <View className="flex-1 items-center py-4">
              <Text className="font-display-bold text-xl text-teal">
                {resolved}
              </Text>
              <Text className="font-body text-mist text-[12px] mt-0.5">
                Resolved
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-6">
          <View className="bg-card border border-hairline rounded-2xl overflow-hidden mb-6">
            {ROWS.map((row, i) => (
              <Pressable
                key={row.label}
                className={`flex-row items-center gap-3.5 px-4 py-4 ${
                  i !== ROWS.length - 1 ? "border-b border-hairline" : ""
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${ROW_BG[row.accent]}`}
                >
                  <Ionicons name={row.icon} size={20} color={ROW_ICON[row.accent]} />
                </View>
                <Text className="font-body-medium text-ink text-[15px] flex-1">
                  {row.label}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#9A9CA5" />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 bg-coral-light rounded-2xl py-4 mb-4"
          >
            <Ionicons name="log-out-outline" size={20} color="#D8492F" />
            <Text className="font-body-semibold text-coral text-[15px]">
              Log out
            </Text>
          </Pressable>

          <Text className="font-body text-mist text-[12px] text-center mb-6">
            SafeGuard admin console v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
