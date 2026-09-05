import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: "amber" | "coral" | "teal";
};

const ACCENT_MAP = {
  amber: { bg: "bg-amber/15", icon: "#8A5C15" },
  coral: { bg: "bg-coral-light", icon: "#D8492F" },
  teal: { bg: "bg-teal-light", icon: "#0F6E56" },
};

export default function StatCard({ label, value, icon, accent }: Props) {
  const a = ACCENT_MAP[accent];
  return (
    <View className="flex-row items-center justify-between bg-card border border-hairline rounded-2xl px-4 py-3.5 mb-3">
      <View className="flex-row items-center gap-3">
        <View className={`w-9 h-9 rounded-full items-center justify-center ${a.bg}`}>
          <Ionicons name={icon} size={18} color={a.icon} />
        </View>
        <Text className="font-body-medium text-ink text-[15px]">{label}</Text>
      </View>
      <Text className="font-display-bold text-ink text-xl">{value}</Text>
    </View>
  );
}
