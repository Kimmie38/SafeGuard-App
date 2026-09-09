import { useState } from "react";
import { View, Text, Pressable, Dimensions, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "shield-checkmark" as const,
    title: "Stay safe",
    body: "Report emergencies instantly and notify nearby responders in your community.",
    accent: "coral" as const,
  },
  {
    icon: "megaphone" as const,
    title: "Stay informed",
    body: "Receive real-time alerts about incidents happening around your location.",
    accent: "amber" as const,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      router.replace("/(auth)/login");
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      {/* siren stripe motif */}
      <View className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <View className="absolute w-40 h-3 bg-amber -rotate-45 top-6 -right-4" />
        <View className="absolute w-40 h-3 bg-coral -rotate-45 top-11 -right-4" />
      </View>

      <View className="flex-row justify-end px-6 pt-4">
        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text className="font-body-medium text-mist text-sm">Skip</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8">
          <Image
            source={require("@/assets/Logo.png")}
            className="w-28 h-28"
            resizeMode="contain"
          />
        </View>
        <Text className="font-display-bold text-3xl text-navy text-center mb-3">
          {slide.title}
        </Text>
        <Text className="font-body text-[15px] text-mist text-center leading-6">
          {slide.body}
        </Text>
      </View>

      <View className="flex-row justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{ width: i === step ? 22 : 7 }}
            className={`h-1.5 rounded-full ${
              i === step ? "bg-navy" : "bg-hairline"
            }`}
          />
        ))}
      </View>

      <View className="px-6 pb-8">
        <Pressable
          onPress={next}
          className="bg-navy rounded-2xl py-4 items-center"
        >
          <Text className="font-body-semibold text-white text-[15px]">
            {isLast ? "Get started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
