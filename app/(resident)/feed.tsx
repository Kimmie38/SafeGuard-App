import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { CATEGORIES, SEVERITY_ORDER } from "@/constants/theme";
import FilterPills from "@/components/FilterPills";
import IncidentCard from "@/components/IncidentCard";

const SORTS = ["Latest", "Nearest", "Most severe"] as const;

export default function Feed() {
  const { reports, userRegion } = useApp();
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Latest");
  const [scope, setScope] = useState<"mine" | "all">("all");

  const filtered = useMemo(() => {
    let list = scope === "mine" ? reports.filter((r) => r.region === userRegion) : reports;

    if (category !== "All") {
      list = list.filter((r) => r.category === category);
    }

    if (sort === "Most severe") {
      list = [...list].sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      );
    } else if (sort === "Nearest") {
      // No real geolocation distance available in this mock — reports
      // from the person's own region are surfaced first as a proxy.
      list = [...list].sort((a, b) =>
        a.region === userRegion && b.region !== userRegion
          ? -1
          : a.region !== userRegion && b.region === userRegion
          ? 1
          : 0
      );
    }
    return list;
  }, [reports, category, sort, scope, userRegion]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="px-5 pt-4">
        <Text className="font-display-bold text-2xl text-navy mb-0.5">
          Emergency feed
        </Text>
        <Text className="font-body text-mist text-[13px] mb-4">
          Real-time emergency reports across Jos
        </Text>

        <View className="flex-row bg-card border border-hairline rounded-2xl p-1 mb-3">
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

        <FilterPills options={CATEGORIES} selected={category} onSelect={setCategory} />

        <View className="flex-row items-center gap-2 mb-4">
          <Text className="font-body text-mist text-[12px] mr-1">Sort:</Text>
          {SORTS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg ${
                sort === s ? "bg-navy" : "bg-card border border-hairline"
              }`}
            >
              <Text
                className={`font-body-medium text-xs ${
                  sort === s ? "text-white" : "text-mist"
                }`}
              >
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <Text className="font-body text-mist text-center mt-10">
            No reports in this category yet.
          </Text>
        ) : (
          filtered.map((r) => <IncidentCard key={r.id} report={r} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
