import { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import ImageViewerModal from "./ImageViewerModal";
import type { Report } from "@/context/AppContext";

type Props = {
  report: Report;
};

export default function IncidentCard({ report }: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const images = report.images ?? [];
  const isLong = report.description.length > 120;

  return (
    <View className="bg-card border border-hairline rounded-2xl p-4 mb-3">
      <Pressable onPress={() => router.push(`/incident/${report.id}`)}>
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1.5">
            <View className="bg-canvas px-2.5 py-1 rounded-full">
              <Text className="font-body-medium text-xs text-mist">
                {report.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-navy/10 px-2.5 py-1 rounded-full">
              <Ionicons name="location" size={10} color="#14213D" />
              <Text className="font-body-medium text-xs text-navy">
                {report.region}
              </Text>
            </View>
          </View>
          <StatusBadge status={report.status} />
        </View>

        <Text className="font-display text-[15px] text-ink mb-1">
          {report.title}
        </Text>
        <Text className="font-body text-[13px] text-mist mb-1" numberOfLines={3}>
          {report.description}
        </Text>
        {isLong && (
          <Text className="font-body-semibold text-navy text-[12px] mb-2">
            See full story
          </Text>
        )}
      </Pressable>

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 mt-1"
          contentContainerStyle={{ gap: 8 }}
        >
          {images.map((uri, i) => (
            <Pressable key={uri + i} onPress={() => setViewerIndex(i)}>
              <Image
                source={{ uri }}
                className="w-20 h-20 rounded-xl bg-canvas"
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="person-outline" size={13} color="#7A7C85" />
          <Text className="font-body text-xs text-mist">{report.reporter}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={13} color="#7A7C85" />
          <Text className="font-body text-xs text-mist">{report.location}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={13} color="#7A7C85" />
          <Text className="font-body text-xs text-mist">{report.timeAgo}</Text>
        </View>
      </View>

      <ImageViewerModal
        images={images}
        visible={viewerIndex !== null}
        index={viewerIndex ?? 0}
        onClose={() => setViewerIndex(null)}
      />
    </View>
  );
}
