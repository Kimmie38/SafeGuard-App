import { View, Text } from "react-native";
import { STATUS_STYLES } from "@/constants/theme";

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Active;
  return (
    <View
      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full ${style.bg}`}
    >
      <View className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <Text className={`font-body-semibold text-xs ${style.text}`}>
        {status}
      </Text>
    </View>
  );
}
