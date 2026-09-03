import { useEffect, useRef } from "react";
import { Animated, Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

const SHEET_WIDTH = Math.min(Dimensions.get("window").width * 0.9, 430);

export default function TopicSheet({ category, problems, completed, onClose }) {
  const translateX = useRef(new Animated.Value(SHEET_WIDTH)).current;
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 180 }).start();
  }, [translateX]);

  const close = () => Animated.timing(translateX, {
    toValue: SHEET_WIDTH, duration: 180, useNativeDriver: true,
  }).start(onClose);

  return (
    <Modal transparent visible animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Close topic" style={StyleSheet.absoluteFill} onPress={close} />
        <Animated.View style={[styles.sheet, { backgroundColor: colors.surface, transform: [{ translateX }] }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>NEETCODE 250</Text>
              <Text style={[styles.title, { color: colors.text }]}>{category}</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                {problems.filter((p) => completed[p.slug]).length} of {problems.length} complete
              </Text>
            </View>
            <Pressable onPress={close} style={[styles.close, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.closeText, { color: colors.text }]}>×</Text>
            </Pressable>
          </View>
          <FlatList
            data={problems}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => { onClose(); router.push(`/question/${item.slug}`); }}
                style={({ pressed }) => [styles.row, { borderColor: colors.border, opacity: pressed ? 0.65 : 1 }]}
              >
                <View style={[styles.number, { backgroundColor: completed[item.slug] ? colors.success : colors.surfaceAlt }]}>
                  <Text style={{ color: completed[item.slug] ? "#fff" : colors.muted, fontWeight: "700" }}>
                    {completed[item.slug] ? "✓" : index + 1}
                  </Text>
                </View>
                <View style={styles.problemText}>
                  <Text style={[styles.problemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={{ color: difficultyColor(item.difficulty, colors), fontSize: 12, fontWeight: "700" }}>
                    {item.difficulty}
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: colors.muted }]}>›</Text>
              </Pressable>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

function difficultyColor(difficulty, colors) {
  if (difficulty === "Easy") return colors.success;
  if (difficulty === "Hard") return colors.danger;
  return "#f59e0b";
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(4, 7, 16, 0.56)", alignItems: "flex-end" },
  sheet: { width: SHEET_WIDTH, height: "100%", paddingTop: 56, borderTopLeftRadius: 28, borderBottomLeftRadius: 28 },
  handle: { position: "absolute", left: 7, top: "47%", width: 4, height: 44, borderRadius: 4 },
  header: { paddingHorizontal: 22, paddingBottom: 18, flexDirection: "row", alignItems: "flex-start" },
  headerText: { flex: 1 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  title: { fontSize: 25, fontWeight: "800", marginTop: 5 }, subtitle: { marginTop: 5, fontSize: 13 },
  close: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: 27, lineHeight: 29 }, list: { paddingHorizontal: 18, paddingBottom: 40 },
  row: { minHeight: 70, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 12 },
  number: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  problemText: { flex: 1, gap: 4 }, problemName: { fontSize: 15, fontWeight: "650" }, arrow: { fontSize: 27 },
});
