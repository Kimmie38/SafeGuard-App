import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

function TabIcon({
  name,
  focused,
  raised,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  raised?: boolean;
}) {
  if (raised) {
    return (
      <View className="w-12 h-12 rounded-full bg-navy items-center justify-center -mt-5">
        <Ionicons name={name} size={22} color="#F2A93B" />
      </View>
    );
  }
  return (
    <Ionicons name={name} size={22} color={focused ? "#14213D" : "#9A9CA5"} />
  );
}

export default function ResidentTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#14213D",
        tabBarInactiveTintColor: "#9A9CA5",
        tabBarStyle: { height: 84, paddingTop: 8 },
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="pulse" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="add" focused={focused} raised />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="notifications" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
