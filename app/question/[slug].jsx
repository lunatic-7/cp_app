import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "../../components/ThemeToggle";
import { noteKey, PROGRESS_KEY } from "../../constants/neetcode";
import { useTheme } from "../../contexts/ThemeContext";
import data from "../../neetcode250_details.json";

export default function QuestionDetail() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const problem = data.problems.find((item) => item.slug === slug);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(true);
  const [openHints, setOpenHints] = useState({});
  const noteRef = useRef("");
  const timerRef = useRef(null);

  const saveNote = useCallback(async (value) => {
    if (!problem) return;
    await AsyncStorage.setItem(noteKey(problem.slug), value);
    setSaved(true);
  }, [problem]);

  useEffect(() => {
    if (!problem) return;
    Promise.all([AsyncStorage.getItem(PROGRESS_KEY), AsyncStorage.getItem(noteKey(problem.slug))])
      .then(([progress, savedNote]) => {
        const parsed = progress ? JSON.parse(progress) : {};
        setDone(Boolean(parsed[problem.slug]));
        const initial = savedNote || "";
        setNote(initial);
        noteRef.current = initial;
      }).catch(() => {});
    return () => {
      clearTimeout(timerRef.current);
      AsyncStorage.setItem(noteKey(problem.slug), noteRef.current);
    };
  }, [problem]);

  const updateNote = (value) => {
    setNote(value); noteRef.current = value; setSaved(false); clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveNote(value), 650);
  };

  const toggleDone = async () => {
    try {
      const raw = await AsyncStorage.getItem(PROGRESS_KEY);
      const progress = raw ? JSON.parse(raw) : {};
      const next = !done;
      progress[problem.slug] = next;
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      setDone(next);
    } catch { Alert.alert("Could not save progress", "Please try again."); }
  };

  const clearNote = () => Alert.alert("Clear your intuition?", "This cannot be undone.", [
    { text: "Cancel", style: "cancel" },
    { text: "Clear", style: "destructive", onPress: () => updateNote("") },
  ]);

  const open = (url) => Linking.openURL(url).catch(() => Alert.alert("Could not open this link."));

  if (!problem) return (
    <SafeAreaView style={[styles.safe, styles.center, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Question not found</Text>
      <Pressable onPress={() => router.back()}><Text style={{ color: colors.primary, marginTop: 12 }}>Go back</Text></Pressable>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}><Text style={[styles.back, { color: colors.text }]}>‹</Text></Pressable>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.text }]}>{problem.category}</Text>
        <ThemeToggle />
      </View>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.category, { color: colors.primary }]}>{problem.category.toUpperCase()}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{problem.name}</Text>
            <Text style={[styles.difficulty, { color: difficultyColor(problem.difficulty, colors) }]}>{problem.difficulty}</Text>
          </View>
          <Pressable onPress={toggleDone} style={[styles.doneButton, { backgroundColor: done ? colors.success : colors.surface, borderColor: done ? colors.success : colors.border }]}>
            <Text style={{ fontSize: done ? 23 : 21, lineHeight: 25, fontWeight: "800", color: done ? "#fff" : colors.muted }}>{done ? "✓" : "✕"}</Text>
            <Text style={{ color: done ? "#fff" : colors.text, fontSize: 12, fontWeight: "800" }}>{done ? "Done" : "Mark done"}</Text>
          </Pressable>
        </View>

        <Section title="Problem" colors={colors}>
          {problem.description.map((paragraph, index) => <Text key={index} style={[styles.body, { color: colors.text }]}>{paragraph}</Text>)}
        </Section>

        {problem.examples.map((example, index) => (
          <Section key={index} title={example.name || `Example ${index + 1}`} colors={colors}>
            <View style={[styles.code, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.codeText, { color: colors.text }]}><Text style={styles.codeLabel}>Input: </Text>{example.input}</Text>
              <Text style={[styles.codeText, { color: colors.text }]}><Text style={styles.codeLabel}>Output: </Text>{example.output}</Text>
              {!!example.explanation && <Text style={[styles.codeText, { color: colors.text }]}><Text style={styles.codeLabel}>Why: </Text>{example.explanation}</Text>}
            </View>
          </Section>
        ))}

        {!!problem.constraints?.length && <Section title="Constraints" colors={colors}>
          {problem.constraints.map((constraint, index) => <Text key={index} style={[styles.bullet, { color: colors.text }]}>•  {constraint}</Text>)}
        </Section>}

        {!!problem.hints?.length && <Section title="Hints" colors={colors} action={<Text style={{ color: colors.muted, fontSize: 12 }}>{problem.hints.length} hidden</Text>}>
          {problem.hints.map((hint, index) => <Pressable key={index} onPress={() => setOpenHints((current) => ({ ...current, [index]: !current[index] }))} style={[styles.hint, { backgroundColor: colors.surfaceAlt }]}>
            <View style={styles.hintRow}><Text style={[styles.hintTitle, { color: colors.text }]}>{hint.title || `Hint ${index + 1}`}</Text><Text style={[styles.chevron, { color: colors.primary }]}>{openHints[index] ? "−" : "+"}</Text></View>
            {openHints[index] && <Text style={[styles.body, { color: colors.muted }]}>{hint.content || hint}</Text>}
          </Pressable>)}
        </Section>}

        <Section title="My intuition" colors={colors} action={<Text style={{ color: saved ? colors.success : colors.muted, fontSize: 12 }}>{saved ? "Saved" : "Saving…"}</Text>}>
          <TextInput
            multiline value={note} onChangeText={updateNote} onBlur={() => saveNote(noteRef.current)}
            placeholder="Write the pattern, approach, or mistake you want to remember…" placeholderTextColor={colors.muted}
            textAlignVertical="top" style={[styles.notes, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          />
          {!!note && <Pressable onPress={clearNote} style={styles.clear}><Text style={{ color: colors.danger, fontWeight: "700" }}>Clear note</Text></Pressable>}
        </Section>

        <View style={styles.links}>
          <Pressable onPress={() => open(`https://neetcode.io${problem.neetcode_url}`)} style={[styles.link, { backgroundColor: colors.primary }]}><Text style={styles.linkText}>Open NeetCode ↗</Text></Pressable>
          <Pressable onPress={() => open(problem.leetcode_url)} style={[styles.link, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.linkText, { color: colors.text }]}>Open LeetCode ↗</Text></Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({ title, colors, action, children }) {
  return <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <View style={styles.sectionHeading}><Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>{action}</View>{children}
  </View>;
}
function difficultyColor(value, colors) { return value === "Easy" ? colors.success : value === "Hard" ? colors.danger : "#f59e0b"; }

const styles = StyleSheet.create({
  safe: { flex: 1 }, keyboard: { flex: 1 }, center: { alignItems: "center", justifyContent: "center" },
  header: { height: 64, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, back: { fontSize: 35, lineHeight: 37 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 14, fontWeight: "700" }, content: { padding: 16, paddingBottom: 50, gap: 14 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 8 }, category: { fontSize: 11, fontWeight: "850", letterSpacing: 1.4 },
  title: { fontSize: 29, fontWeight: "850", letterSpacing: -0.7, marginTop: 5 }, difficulty: { fontWeight: "800", fontSize: 13, marginTop: 7 },
  doneButton: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, height: 44, flexDirection: "row", alignItems: "center", gap: 5 },
  section: { borderWidth: 1, borderRadius: 20, padding: 17, gap: 11 }, sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, sectionTitle: { fontSize: 18, fontWeight: "800" },
  body: { fontSize: 15, lineHeight: 23 }, bullet: { fontSize: 14, lineHeight: 22 }, code: { borderRadius: 13, padding: 14, gap: 8 }, codeText: { fontSize: 13, lineHeight: 20, fontFamily: "monospace" }, codeLabel: { fontWeight: "800", color: "#287D75" },
  hint: { borderRadius: 13, padding: 14, gap: 9 }, hintRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, hintTitle: { flex: 1, fontSize: 14, fontWeight: "800" }, chevron: { fontSize: 25, lineHeight: 27, fontWeight: "600" }, notes: { minHeight: 155, borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 15, lineHeight: 22 },
  clear: { alignSelf: "flex-end", paddingVertical: 3 }, links: { flexDirection: "row", gap: 10, marginTop: 2 }, link: { flex: 1, borderRadius: 15, minHeight: 50, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, linkText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
