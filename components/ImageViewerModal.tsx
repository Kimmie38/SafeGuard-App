import { useState } from "react";
import { Modal, View, Image, Pressable, Text, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Props = {
  images: string[];
  visible: boolean;
  index: number;
  onClose: () => void;
};

export default function ImageViewerModal({ images, visible, index, onClose }: Props) {
  const [current, setCurrent] = useState(index);

  if (!images.length) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/95">
        <SafeAreaView className="flex-1">
          <View className="flex-row justify-between items-center px-5 pt-2 pb-4">
            <Text className="font-body-medium text-white/70 text-[13px]">
              {current + 1} of {images.length}
            </Text>
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: index * width, y: 0 }}
            onMomentumScrollEnd={(e) =>
              setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))
            }
          >
            {images.map((uri, i) => (
              <View key={uri + i} style={{ width }} className="items-center justify-center px-4">
                <Image
                  source={{ uri }}
                  style={{ width: width - 32, height: width - 32 }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
