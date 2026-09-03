import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { PanResponder, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const fitScale = Math.max(0.3, Math.min((width - 24) / CANVAS_WIDTH, (height - 190) / CANVAS_HEIGHT, 1));
  const [scale, setScale] = useState(fitScale);
  const scaleRef = useRef(scale);
  const pinchStart = useRef({ distance: 0, scale });

  useEffect(() => { setScale(fitScale); scaleRef.current = fitScale; }, [fitScale]);

  const applyScale = useCallback((next) => {
    const bounded = Math.min(1.5, Math.max(fitScale, next));
    scaleRef.current = bounded;
    setScale(bounded);
  }, [fitScale]);

  const pinchResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length === 2,
    onMoveShouldSetPanResponder: (event) => event.nativeEvent.touches.length === 2,
    onMoveShouldSetPanResponderCapture: (event) => event.nativeEvent.touches.length === 2,
    onPanResponderGrant: (event) => {
      if (event.nativeEvent.touches.length === 2) pinchStart.current = { distance: touchDistance(event.nativeEvent.touches), scale: scaleRef.current };
    },
    onPanResponderMove: (event) => {
      if (event.nativeEvent.touches.length !== 2 || !pinchStart.current.distance) return;
      applyScale(pinchStart.current.scale * touchDistance(event.nativeEvent.touches) / pinchStart.current.distance);
    },
  }), [applyScale]);

  const loadProgress = useCallback(async () => {
    const value = await AsyncStorage.getItem(PROGRESS_KEY);
    setCompleted(value ? JSON.parse(value) : {});
  }, []);

  useFocusEffect(useCallback(() => {
    loadProgress().catch(() => {});
  }, [loadProgress]));

  const refresh = async () => {
    setRefreshing(true);
    try { await loadProgress(); } finally { setRefreshing(false); }
  };

  const byCategory = useMemo(() => data.problems.reduce((map, problem) => {
    (map[problem.category] ||= []).push(problem);
    return map;
  }, {}), []);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const selectedProblems = useMemo(() => {
    const order = { Easy: 0, Medium: 1, Hard: 2 };
    return selected ? [...(byCategory[selected] || [])].sort((a, b) => (order[a.difficulty] ?? 3) - (order[b.difficulty] ?? 3)) : [];
  }, [byCategory, selected]);

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
      <View style={styles.graphTools}>
        <Text style={[styles.zoomHint, { color: colors.muted }]}>Pinch with two fingers to zoom</Text>
        <View style={[styles.zoomGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable onPress={() => applyScale(scale - 0.1)} style={styles.zoomButton}><Text style={[styles.zoomText, { color: colors.text }]}>−</Text></Pressable>
          <Pressable onPress={() => applyScale(fitScale)} style={styles.zoomReset}><Text style={[styles.zoomPercent, { color: colors.muted }]}>{Math.round(scale * 100)}%</Text></Pressable>
          <Pressable onPress={() => applyScale(scale + 0.1)} style={styles.zoomButton}><Text style={[styles.zoomText, { color: colors.text }]}>+</Text></Pressable>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}>
          <View style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }} {...pinchResponder.panHandlers}>
          <View style={[styles.canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: [{ scale }], transformOrigin: "top left" }]}>
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
  progressBadge: { height: 43, minWidth: 67, borderRadius: 14, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  progressNumber: { fontSize: 18, fontWeight: "850" }, progressTotal: { fontSize: 11, fontWeight: "700" },
  progressTrack: { height: 3 }, progressFill: { height: 3 }, horizontal: { paddingHorizontal: 12 },
  graphTools: { minHeight: 48, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  zoomHint: { flex: 1, fontSize: 11, fontWeight: "600" }, zoomGroup: { height: 34, borderWidth: 1, borderRadius: 11, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  zoomButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center" }, zoomReset: { minWidth: 48, height: 34, alignItems: "center", justifyContent: "center" },
  zoomText: { fontSize: 21, lineHeight: 23, fontWeight: "600" }, zoomPercent: { fontSize: 10, fontWeight: "800" },
  canvas: { position: "relative" }, node: { position: "absolute", width: NODE_WIDTH, minHeight: NODE_HEIGHT, borderRadius: 17, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 10, justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  nodeTitle: { fontSize: 14, fontWeight: "750", textAlign: "center" }, nodeFooter: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 7 },
  nodeTrack: { flex: 1, height: 4, borderRadius: 3, overflow: "hidden" }, nodeCount: { fontSize: 10, fontWeight: "700" },
});

function touchDistance(touches) {
  const [a, b] = touches;
  return Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
}
