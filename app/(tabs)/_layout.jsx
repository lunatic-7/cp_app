import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const TabIcon = ({ glyph, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Text style={{ color, fontSize: 22 }}>{glyph}</Text>
      <Text
        className={`${focused ? "font-semibold" : "font-normal"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 78,
          paddingTop: 7,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Neetcode 250",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              glyph="⌘"
              color={color}
              name="Neetcode"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="codeforces"
        options={{
          title: "Codeforces",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              glyph="⚑"
              color={color}
              name="Codeforces"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
