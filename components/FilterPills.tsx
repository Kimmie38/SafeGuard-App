import { ScrollView, Pressable, Text } from "react-native";

type Props = {
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterPills({ options, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-3"
      contentContainerStyle={{ gap: 8, paddingRight: 16 }}
    >
      {options.map((opt) => {
        const active = opt === selected;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            className={`px-3.5 py-2 rounded-full border ${
              active ? "bg-navy border-navy" : "bg-card border-hairline"
            }`}
          >
            <Text
              className={`font-body-medium text-[13px] ${
                active ? "text-white" : "text-ink"
              }`}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
