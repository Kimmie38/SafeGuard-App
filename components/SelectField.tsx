import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  label: string;
  value: string | null;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  options,
  placeholder = "Select an option",
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text className="font-body-medium text-ink text-[13px] mb-1.5">
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between bg-card border border-hairline rounded-xl px-4 py-3.5"
      >
        <Text
          className={`font-body text-[15px] ${value ? "text-ink" : "text-mist"}`}
        >
          {value ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9A9CA5" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-black/40 justify-end">
          <SafeAreaView className="bg-card rounded-t-3xl max-h-[70%]" edges={["bottom"]}>
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
              <Text className="font-display text-[17px] text-navy">{label}</Text>
              <Pressable onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color="#1B1B1D" />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between px-5 py-3.5 border-b border-hairline"
                >
                  <Text className="font-body text-[15px] text-ink">{item}</Text>
                  {item === value && (
                    <Ionicons name="checkmark" size={18} color="#14213D" />
                  )}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
