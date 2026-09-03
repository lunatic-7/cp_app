import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

const TabIcon = ({ glyph, color, name, focused }) => {
  return (
    <View style={{ flex: 1, minWidth: 120, alignItems: "center", justifyContent: "center", gap: 2 }}>
      <Text style={{ color, fontSize: 20, lineHeight: 23 }}>{glyph}</Text>
      <Text
        numberOfLines={1}
        style={{ color, fontSize: 11, lineHeight: 14, fontWeight: focused ? "800" : "600" }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
          height: 58 + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 5),
        },
        tabBarItemStyle: { flex: 1 },
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
