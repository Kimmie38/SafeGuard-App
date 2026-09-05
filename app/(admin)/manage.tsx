import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, Report } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import FilterPills from "@/components/FilterPills";
import { STATUS_LIST } from "@/constants/theme";

const STATUS_FILTERS = ["All", ...STATUS_LIST] as const;

export default function ManageReports() {
  const { reports, userRegion, updateReportStatus } = useApp();
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const filtered = reports
    .filter((r) => (scope === "mine" ? r.region === userRegion : true))
    .filter((r) => (filter === "All" ? true : r.status === filter));

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="px-5 pt-4">
        <Text className="font-display-bold text-2xl text-navy mb-0.5">
          Manage reports
        </Text>
        <Text className="font-body text-mist text-[13px] mb-4">
          Update case status as your team responds
        </Text>

        <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mb-4">
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

        <FilterPills options={STATUS_FILTERS} selected={filter} onSelect={setFilter} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <Text className="font-body text-mist text-center mt-10">
            Nothing here.
          </Text>
        ) : (
          filtered.map((r) => (
            <View
              key={r.id}
              className="bg-card border border-hairline rounded-2xl p-4 mb-3"
            >
              <Pressable onPress={() => router.push(`/incident/${r.id}`)}>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-body-medium text-xs text-mist">{r.id}</Text>
                  <StatusBadge status={r.status} />
                </View>
                <Text className="font-display text-[15px] text-ink mb-1">
                  {r.title}
                </Text>
                <Text className="font-body text-[13px] text-mist mb-2" numberOfLines={2}>
                  {r.description}
                </Text>
                <Text className="font-body text-xs text-mist mb-3">
                  {r.location}, {r.region} • {r.timeAgo}
                </Text>
              </Pressable>

              <View className="flex-row gap-2">
                {STATUS_LIST.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => updateReportStatus(r.id, s)}
                    className={`flex-1 py-2.5 rounded-xl border items-center ${
                      r.status === s ? "bg-navy border-navy" : "bg-canvas border-hairline"
                    }`}
                  >
                    <Text
                      className={`font-body-semibold text-[11px] ${
                        r.status === s ? "text-white" : "text-ink"
                      }`}
                    >
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
