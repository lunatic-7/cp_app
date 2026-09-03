import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle({ style }) {
  const { isDark, colors, toggleTheme } = useTheme();
  return (
    <Pressable
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} mode`}
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text style={styles.icon}>{isDark ? "☀" : "☾"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
});
