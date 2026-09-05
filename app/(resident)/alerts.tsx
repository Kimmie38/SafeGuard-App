import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";

const TABS = ["All", "Emergencies", "Announcements", "Updates"] as const;

const TYPE_TO_TAB: Record<string, (typeof TABS)[number]> = {
  Emergency: "Emergencies",
  Announcement: "Announcements",
  Update: "Updates",
};

const ICON_MAP: Record<string, { name: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  Emergency: { name: "warning", bg: "bg-coral-light", color: "#D8492F" },
  Update: { name: "notifications", bg: "bg-teal-light", color: "#0F6E56" },
  Announcement: { name: "megaphone", bg: "bg-amber/20", color: "#8A5C15" },
};

export default function Alerts() {
  const { alerts, userRegion } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const filtered = useMemo(() => {
    let list = tab === "All" ? alerts : alerts.filter((a) => TYPE_TO_TAB[a.type] === tab);
    if (scope === "mine" && userRegion) {
      list = list.filter((a) => !a.region || a.region === userRegion);
    }
    return list;
  }, [alerts, tab, scope, userRegion]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="px-5 pt-4">
        <Text className="font-display-bold text-2xl text-navy mb-0.5">
          Notifications
        </Text>
        <Text className="font-body text-mist text-[13px] mb-3">
          Stay updated on community events
        </Text>

        {userRegion && (
          <View className="flex-row bg-card border border-hairline rounded-full p-1 mb-3">
            <Pressable
              onPress={() => setScope("mine")}
              className={`flex-1 py-2 rounded-full items-center ${scope === "mine" ? "bg-navy" : ""}`}
            >
              <Text className={`font-body-semibold text-[12px] ${scope === "mine" ? "text-white" : "text-mist"}`}>
                {userRegion}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setScope("all")}
              className={`flex-1 py-2 rounded-full items-center ${scope === "all" ? "bg-navy" : ""}`}
            >
              <Text className={`font-body-semibold text-[12px] ${scope === "all" ? "text-white" : "text-mist"}`}>
                All of Jos
              </Text>
            </Pressable>
          </View>
        )}

        <View className="flex-row border-b border-hairline mb-1">
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              className={`mr-5 pb-2.5 ${tab === t ? "border-b-2 border-navy" : ""}`}
            >
              <Text
                className={`font-body-medium text-[13px] ${
                  tab === t ? "text-navy" : "text-mist"
                }`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <Text className="font-body text-mist text-center mt-10">
            No notifications here yet.
          </Text>
        ) : (
          filtered.map((a) => {
            const icon = ICON_MAP[a.type];
            return (
              <View
                key={a.id}
                className={`flex-row gap-3 bg-card rounded-2xl p-4 mb-3 border ${
                  a.unread ? "border-navy/30" : "border-hairline"
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${icon.bg}`}>
                  <Ionicons name={icon.name} size={18} color={icon.color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-body-semibold text-ink text-[14px] flex-1 pr-2">
                      {a.title}
                    </Text>
                    {a.unread && <View className="w-2 h-2 rounded-full bg-coral" />}
                  </View>
                  <Text className="font-body text-mist text-[13px] mt-0.5 leading-5">
                    {a.message}
                  </Text>
                  <Text className="font-body text-mist text-[11px] mt-1.5">
                    {a.timeAgo}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
