import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { icons } from "../constants";

export default function HandleSetup({ onSubmit }) {
  const { colors } = useTheme();
  const [handle, setHandle] = useState("");
  const submit = () => { const value = handle.trim(); if (value) onSubmit(value); };
  return (
    <View style={styles.screen}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.mark, { backgroundColor: colors.primarySoft }]}><Image source={icons.cf_icon} resizeMode="contain" style={styles.markIcon} /></View>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>WELCOME TO CODEFORCES</Text>
        <Text style={[styles.title, { color: colors.text }]}>Track your competitive programming journey.</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Enter your handle once. We’ll remember it on this device and open your dashboard automatically next time.</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TextInput value={handle} onChangeText={setHandle} onSubmitEditing={submit} placeholder="Your Codeforces handle" placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false} returnKeyType="go" style={[styles.input, { color: colors.text }]} />
        </View>
        <Pressable disabled={!handle.trim()} onPress={submit} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: !handle.trim() ? 0.45 : pressed ? 0.75 : 1 }]}><Text style={styles.buttonText}>Open my dashboard</Text></Pressable>
        <Text style={[styles.privacy, { color: colors.muted }]}>Stored locally · No account or password required</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 530, padding: 18, justifyContent: "center" }, card: { borderWidth: 1, borderRadius: 26, padding: 22, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  mark: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 18 }, markIcon: { width: 38, height: 38 }, eyebrow: { fontSize: 10, fontWeight: "850", letterSpacing: 1.4 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "850", textAlign: "center", letterSpacing: -0.6, marginTop: 9 }, subtitle: { fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 9 },
  inputWrap: { width: "100%", height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, marginTop: 24 }, input: { flex: 1, fontSize: 15 }, button: { width: "100%", height: 52, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 11 }, buttonText: { color: "#fff", fontWeight: "850" }, privacy: { fontSize: 10, marginTop: 14 },
});
