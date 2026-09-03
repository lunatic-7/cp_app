import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export default function NotFound() {
  const router = useRouter(); const { colors } = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}><View style={styles.top}><ThemeToggle /></View><View style={styles.center}><Text style={[styles.code, { color: colors.primary }]}>404</Text><Text style={[styles.title, { color: colors.text }]}>This page wandered off</Text><Text style={[styles.text, { color: colors.muted }]}>The route may have moved or no longer exists.</Text><Pressable onPress={() => router.replace("/(tabs)")} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>Back to roadmap</Text></Pressable></View></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, top: { padding: 16 }, center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 }, code: { fontSize: 58, fontWeight: "900" }, title: { fontSize: 23, fontWeight: "850", marginTop: 6 }, text: { textAlign: "center", marginTop: 8 }, button: { borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13, marginTop: 22 }, buttonText: { color: "#fff", fontWeight: "800" } });
