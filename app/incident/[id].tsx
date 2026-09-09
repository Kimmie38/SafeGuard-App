import { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Share, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, Report, ApiError } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import ImageViewerModal from "@/components/ImageViewerModal";
import { STATUS_LIST } from "@/constants/theme";

export default function IncidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reports, role, userRegion, updateReportStatus } = useApp();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-canvas items-center justify-center px-6">
        <Text className="font-body text-mist text-center">
          This report is no longer available.
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-body-semibold text-navy">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const images = report.images ?? [];

  const handleStatusChange = (status: Report["status"]) => {
    updateReportStatus(report.id, status).catch((err) => {
      Alert.alert(
        "Couldn't update status",
        err instanceof ApiError ? err.message : "Please check your connection and try again."
      );
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${report.title}\n\n${report.description}\n\nCategory: ${report.category}\nLocation: ${report.location}, ${report.region}\nStatus: ${report.status}\n\nReported via SafeGuard`,
      });
    } catch {
      // user cancelled or share sheet failed silently — nothing to recover
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-card border border-hairline items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="#1B1B1D" />
        </Pressable>
        <Pressable
          onPress={handleShare}
          className="w-9 h-9 rounded-full bg-card border border-hairline items-center justify-center"
        >
          <Ionicons name="share-social-outline" size={18} color="#1B1B1D" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-canvas border border-hairline px-2.5 py-1 rounded-full">
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
          <StatusBadge status={report.status} />
        </View>

        <Text className="font-display-bold text-2xl text-ink mb-3">
          {report.title}
        </Text>

        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="person-outline" size={14} color="#7A7C85" />
            <Text className="font-body text-[13px] text-mist">{report.reporter}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#7A7C85" />
            <Text className="font-body text-[13px] text-mist">{report.timeAgo}</Text>
          </View>
        </View>

        {images.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-5">
            {images.map((uri, i) => (
              <Pressable key={uri + i} onPress={() => setViewerIndex(i)}>
                <Image
                  source={{ uri }}
                  className="w-[110px] h-[110px] rounded-xl bg-card"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        )}

        <Text className="font-body text-[15px] text-ink leading-6 mb-6">
          {report.description}
        </Text>

        <View className="bg-card border border-hairline rounded-2xl p-4 mb-6">
          <Row icon="location-outline" label="Location" value={report.location} />
          <Row icon="alert-circle-outline" label="Severity" value={report.severity} last />
        </View>

        {role === "admin" && report.region === userRegion && (
          <View className="mb-6">
            <Text className="font-body-medium text-ink text-[13px] mb-2">
              Update status
            </Text>
            <View className="flex-row gap-2">
              {STATUS_LIST.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => handleStatusChange(s)}
                  className={`flex-1 py-3 rounded-xl border items-center ${
                    report.status === s ? "bg-navy border-navy" : "bg-card border-hairline"
                  }`}
                >
                  <Text
                    className={`font-body-semibold text-[12px] ${
                      report.status === s ? "text-white" : "text-ink"
                    }`}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {role === "admin" && report.region !== userRegion && (
          <View className="mb-6 bg-card border border-hairline rounded-2xl p-4">
            <Text className="font-body text-mist text-[13px]">
              This report is outside your coverage area — it's managed by {report.region}'s area chairman.
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleShare}
          className="flex-row items-center justify-center gap-2 bg-navy rounded-2xl py-3.5"
        >
          <Ionicons name="share-social-outline" size={18} color="white" />
          <Text className="font-body-semibold text-white text-[14px]">
            Share this report
          </Text>
        </Pressable>
      </ScrollView>

      <ImageViewerModal
        images={images}
        visible={viewerIndex !== null}
        index={viewerIndex ?? 0}
        onClose={() => setViewerIndex(null)}
      />
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 py-2.5 ${
        last ? "" : "border-b border-hairline"
      }`}
    >
      <Ionicons name={icon} size={16} color="#7A7C85" />
      <Text className="font-body text-mist text-[13px] w-20">{label}</Text>
      <Text className="font-body-medium text-ink text-[13px] flex-1">{value}</Text>
    </View>
  );
}
