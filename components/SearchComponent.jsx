import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function SearchComponent({ onSearch }) {
  const { colors } = useTheme();
  const [handle, setHandle] = useState("");
  const submit = () => { const value = handle.trim(); if (value) { onSearch(value); setHandle(""); } };
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TextInput
        placeholder="Switch Codeforces handle" placeholderTextColor={colors.muted} value={handle} onChangeText={setHandle}
        onSubmitEditing={submit} returnKeyType="search" autoCapitalize="none" autoCorrect={false}
        style={[styles.input, { color: colors.text }]}
      />
      <Pressable onPress={submit} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 }]}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginBottom: 22, height: 54, borderRadius: 17, borderWidth: 1, paddingLeft: 14, paddingRight: 5, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, height: "100%", fontSize: 14 }, button: { height: 42, borderRadius: 13, paddingHorizontal: 15, alignItems: "center", justifyContent: "center" }, buttonText: { color: "#fff", fontWeight: "800" },
});
