import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { CATEGORIES } from "@/constants/theme";

const REPORT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");
const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;

export default function Report() {
  const { addReport, userRegion } = useApp();
  const [category, setCategory] = useState<string>(REPORT_CATEGORIES[0]);
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // No hard cap on photo count or description length — full story is
  // always available on the detail screen even if cards truncate it.
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to attach images to your report."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

  const submit = () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert("Missing details", "Please fill in every field before submitting.");
      return;
    }
    addReport({ category, title, description, location, severity, images });
    setTitle("");
    setDescription("");
    setLocation("");
    setImages([]);
    Alert.alert(
      "Report submitted",
      `Responders and neighbors in ${userRegion ?? "your area"} have been notified.`,
      [{ text: "View feed", onPress: () => router.push("/(resident)/feed") }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4 mb-1">
            <Text className="font-display-bold text-2xl text-navy">
              Report an emergency
            </Text>
            <Text className="font-body text-mist text-[13px] mb-5">
              Give responders what they need to act fast — write as much detail
              as you need, there's no limit.
            </Text>
          </View>

          <Text className="font-body-medium text-ink text-[13px] mb-2">
            Emergency type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {REPORT_CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                className={`px-3.5 py-2 rounded-full border ${
                  category === c ? "bg-navy border-navy" : "bg-card border-hairline"
                }`}
              >
                <Text
                  className={`font-body-medium text-[12px] ${
                    category === c ? "text-white" : "text-ink"
                  }`}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-ink text-[13px] mb-2">
            Severity
          </Text>
          <View className="flex-row gap-2 mb-4">
            {SEVERITIES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSeverity(s)}
                className={`flex-1 py-2 rounded-xl border items-center ${
                  severity === s ? "bg-coral border-coral" : "bg-card border-hairline"
                }`}
              >
                <Text
                  className={`font-body-medium text-[12px] ${
                    severity === s ? "text-white" : "text-ink"
                  }`}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-ink text-[13px] mb-1.5">
            Short title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Armed robbery near Terminus Market"
            placeholderTextColor="#9A9CA5"
            className="bg-card border border-hairline rounded-xl px-4 py-3.5 mb-4 font-body text-ink"
          />

          <Text className="font-body-medium text-ink text-[13px] mb-1.5">
            Full story
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What's happening? Include everything responders and neighbors should know — there's no length limit."
            placeholderTextColor="#9A9CA5"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="bg-card border border-hairline rounded-xl px-4 py-3.5 mb-4 font-body text-ink min-h-[140px]"
          />

          <Text className="font-body-medium text-ink text-[13px] mb-1.5">
            Location
          </Text>
          <View className="flex-row items-center bg-card border border-hairline rounded-xl px-4 mb-6">
            <Ionicons name="location-outline" size={16} color="#9A9CA5" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder={`e.g. near Terminus Market, ${userRegion ?? "Jos"}`}
              placeholderTextColor="#9A9CA5"
              className="flex-1 py-3.5 pl-2 font-body text-ink"
            />
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-body-medium text-ink text-[13px]">
              Photos
            </Text>
            <Text className="font-body text-mist text-[12px]">
              Optional • add as many as you need
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {images.map((uri) => (
              <View key={uri} className="relative">
                <Image
                  source={{ uri }}
                  className="w-20 h-20 rounded-xl bg-card"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => removeImage(uri)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-navy items-center justify-center"
                >
                  <Ionicons name="close" size={12} color="white" />
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={pickImages}
              className="w-20 h-20 rounded-xl border border-dashed border-hairline items-center justify-center bg-card"
            >
              <Ionicons name="camera-outline" size={20} color="#9A9CA5" />
              <Text className="font-body text-mist text-[10px] mt-1">Add</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={submit}
            className="bg-coral rounded-2xl py-4 items-center flex-row justify-center gap-2"
          >
            <Ionicons name="alert-circle" size={18} color="white" />
            <Text className="font-body-semibold text-white text-[15px]">
              Submit report
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
