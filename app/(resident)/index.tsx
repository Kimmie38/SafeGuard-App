import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import IncidentCard from "@/components/IncidentCard";

const SEVERITY_RING: Record<string, string> = {
  Critical: "border-coral",
  High: "border-amber",
  Medium: "border-navy",
  Low: "border-hairline",
};

export default function Home() {
  const { userName, userRegion, alerts, reports } = useApp();
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const unreadCount = alerts.filter((a) => a.unread).length;

  const stories = useMemo(
    () => reports.filter((r) => r.status !== "Resolved").slice(0, 8),
    [reports]
  );

  const feed = useMemo(() => {
    return scope === "mine"
      ? reports.filter((r) => r.region === userRegion)
      : reports;
  }, [reports, scope, userRegion]);

  const active = feed.filter((r) => r.status === "Active").length;
  const resolved = feed.filter((r) => r.status === "Resolved").length;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      {/* top bar */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-navy items-center justify-center">
            <Ionicons name="shield-checkmark" size={16} color="#F2A93B" />
          </View>
          <Text className="font-display-bold text-lg text-navy">SafeGuard</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.push("/(resident)/feed")}>
            <Ionicons name="search" size={22} color="#1B1B1D" />
          </Pressable>
          <Pressable onPress={() => router.push("/(resident)/alerts")} className="relative">
            <Ionicons name="notifications-outline" size={22} color="#1B1B1D" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral items-center justify-center">
                <Text className="text-white text-[9px] font-body-semibold">
                  {unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-body text-mist text-[13px] px-5 mb-3">
          Welcome back, {userName.split(" ")[0]}
        </Text>

        {/* stories strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {stories.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/incident/${r.id}`)}
              className="items-center w-16"
            >
              <View
                className={`w-14 h-14 rounded-full border-2 items-center justify-center bg-card ${
                  SEVERITY_RING[r.severity] ?? "border-hairline"
                }`}
              >
                <Ionicons name="alert-circle" size={20} color="#14213D" />
              </View>
              <Text
                className="font-body text-[10px] text-mist mt-1 text-center"
                numberOfLines={1}
              >
                {r.region}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* region scope toggle */}
        <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mx-5 mb-4">
          <Pressable
            onPress={() => setScope("mine")}
            className={`flex-1 py-2 rounded-xl items-center ${
              scope === "mine" ? "bg-navy" : ""
            }`}
          >
            <Text
              className={`font-body-semibold text-[12px] ${
                scope === "mine" ? "text-white" : "text-mist"
              }`}
            >
              {userRegion}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setScope("all")}
            className={`flex-1 py-2 rounded-xl items-center ${
              scope === "all" ? "bg-navy" : ""
            }`}
          >
            <Text
              className={`font-body-semibold text-[12px] ${
                scope === "all" ? "text-white" : "text-mist"
              }`}
            >
              All of Jos
            </Text>
          </Pressable>
        </View>

        {/* compact stat strip */}
        <View className="flex-row gap-2 px-5 mb-5">
          <View className="flex-1 bg-card border border-hairline rounded-xl py-2.5 items-center">
            <Text className="font-display-bold text-base text-ink">{feed.length}</Text>
            <Text className="font-body text-mist text-[11px]">Reports</Text>
          </View>
          <View className="flex-1 bg-card border border-hairline rounded-xl py-2.5 items-center">
            <Text className="font-display-bold text-base text-coral">{active}</Text>
            <Text className="font-body text-mist text-[11px]">Active</Text>
          </View>
          <View className="flex-1 bg-card border border-hairline rounded-xl py-2.5 items-center">
            <Text className="font-display-bold text-base text-teal">{resolved}</Text>
            <Text className="font-body text-mist text-[11px]">Resolved</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-5 mb-3">
          <Text className="font-display text-[17px] text-navy">
            {scope === "mine" ? `Feed — ${userRegion}` : "Feed — All of Jos"}
          </Text>
          <Pressable onPress={() => router.push("/(resident)/feed")}>
            <Text className="font-body-medium text-navy text-[13px]">View all</Text>
          </Pressable>
        </View>

        <View className="px-5">
          {feed.length === 0 ? (
            <Text className="font-body text-mist text-center mt-6">
              No reports here yet.
            </Text>
          ) : (
            feed.slice(0, 6).map((r) => <IncidentCard key={r.id} report={r} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
