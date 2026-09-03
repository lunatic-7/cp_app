import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import ThemeToggle from "../../components/ThemeToggle";
import TopicSheet from "../../components/TopicSheet";
import { PROGRESS_KEY, ROADMAP_EDGES, ROADMAP_NODES } from "../../constants/neetcode";
import { useTheme } from "../../contexts/ThemeContext";
import data from "../../neetcode250_details.json";

const NODE_WIDTH = 170;
const NODE_HEIGHT = 64;
const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 1125;

export default function NeetcodeRoadmap() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState({});

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(PROGRESS_KEY).then((value) => setCompleted(value ? JSON.parse(value) : {})).catch(() => {});
  }, []));

  const byCategory = useMemo(() => data.problems.reduce((map, problem) => {
    (map[problem.category] ||= []).push(problem);
    return map;
  }, {}), []);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const selectedProblems = selected ? byCategory[selected] || [] : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.topbar}>
        <ThemeToggle />
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.text }]}>NeetCode 250</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Follow the path. Master the patterns.</Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.progressNumber, { color: colors.primary }]}>{completedCount}</Text>
          <Text style={[styles.progressTotal, { color: colors.muted }]}>/250</Text>
        </View>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${completedCount / 2.5}%` }]} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: CANVAS_HEIGHT }}>
          <View style={[styles.canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }]}>
            <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={StyleSheet.absoluteFill}>
              {ROADMAP_EDGES.map(([from, to]) => {
                const a = ROADMAP_NODES.find((node) => node.name === from);
                const b = ROADMAP_NODES.find((node) => node.name === to);
                const x1 = a.x + NODE_WIDTH / 2, y1 = a.y + NODE_HEIGHT;
                const x2 = b.x + NODE_WIDTH / 2, y2 = b.y;
                const middle = (y1 + y2) / 2;
                return <Path key={`${from}-${to}`} d={`M ${x1} ${y1} C ${x1} ${middle}, ${x2} ${middle}, ${x2} ${y2}`} stroke={colors.line} strokeWidth="3" fill="none" opacity="0.7" />;
              })}
            </Svg>
            {ROADMAP_NODES.map((node) => {
              const problems = byCategory[node.name] || [];
              const done = problems.filter((problem) => completed[problem.slug]).length;
              return (
                <Pressable key={node.name} onPress={() => setSelected(node.name)} style={({ pressed }) => [
                  styles.node, { left: node.x, top: node.y, backgroundColor: colors.surface, borderColor: done === problems.length ? colors.success : colors.primary, opacity: pressed ? 0.75 : 1 },
                ]}>
                  <Text numberOfLines={2} style={[styles.nodeTitle, { color: colors.text }]}>{node.name}</Text>
                  <View style={styles.nodeFooter}>
                    <View style={[styles.nodeTrack, { backgroundColor: colors.border }]}>
                      <View style={{ height: "100%", borderRadius: 3, backgroundColor: colors.primary, width: `${problems.length ? done / problems.length * 100 : 0}%` }} />
                    </View>
                    <Text style={[styles.nodeCount, { color: colors.muted }]}>{done}/{problems.length}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
      {selected && <TopicSheet category={selected} problems={selectedProblems} completed={completed} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 }, topbar: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 13, flexDirection: "row", alignItems: "center", gap: 12 },
  heading: { flex: 1 }, title: { fontSize: 24, fontWeight: "850", letterSpacing: -0.5 }, subtitle: { fontSize: 12, marginTop: 2 },
  progressBadge: { height: 43, minWidth: 67, borderRadius: 14, paddingHorizontal: 9, flexDirection: "row", alignItems: "baseline", justifyContent: "center" },
  progressNumber: { fontSize: 18, fontWeight: "850" }, progressTotal: { fontSize: 11, fontWeight: "700" },
  progressTrack: { height: 3 }, progressFill: { height: 3 }, horizontal: { minWidth: CANVAS_WIDTH },
  canvas: { position: "relative" }, node: { position: "absolute", width: NODE_WIDTH, minHeight: NODE_HEIGHT, borderRadius: 17, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 10, justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  nodeTitle: { fontSize: 14, fontWeight: "750", textAlign: "center" }, nodeFooter: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 7 },
  nodeTrack: { flex: 1, height: 4, borderRadius: 3, overflow: "hidden" }, nodeCount: { fontSize: 10, fontWeight: "700" },
});
