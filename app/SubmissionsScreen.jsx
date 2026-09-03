import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

const DAYS = Array.from({ length: 7 }, (_, index) => ({ offset: index, label: index === 0 ? "Today" : index === 1 ? "Yesterday" : new Date(Date.now() - index * 864e5).toLocaleDateString(undefined, { weekday: "short" }) }));

export default function SubmissionsScreen() {
  const { handle: rawHandle } = useLocalSearchParams();
  const handle = Array.isArray(rawHandle) ? rawHandle[0] : rawHandle || "wasif1607";
  const router = useRouter();
  const { colors } = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [day, setDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true); setError(null);
    try {
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=350`);
      if (response.data.status !== "OK") throw new Error("Codeforces rejected the request");
      setSubmissions(response.data.result);
    } catch { setError("Couldn’t load submissions. Check your connection and try again."); }
    finally { setLoading(false); setRefreshing(false); }
  }, [handle]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);
  const filtered = useMemo(() => submissions.filter((item) => sameLocalDay(item.creationTimeSeconds * 1000, Date.now() - day * 864e5)), [submissions, day]);
  const stats = useMemo(() => filtered.reduce((result, item) => { result[item.verdict] = (result[item.verdict] || 0) + 1; return result; }, {}), [filtered]);

  const header = <>
    <View style={styles.heroRow}>
      <View><Text style={[styles.eyebrow, { color: colors.primary }]}>@{handle}</Text><Text style={[styles.pageTitle, { color: colors.text }]}>Daily submissions</Text></View>
      <Pressable onPress={() => router.push({ pathname: "/Analytics", params: { sub_handle: handle } })} style={[styles.analytics, { backgroundColor: colors.primarySoft }]}><Text style={{ color: colors.primary, fontWeight: "850" }}>Analytics →</Text></Pressable>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
      {DAYS.map((item) => <Pressable key={item.offset} onPress={() => setDay(item.offset)} style={[styles.day, { backgroundColor: day === item.offset ? colors.primary : colors.surface, borderColor: day === item.offset ? colors.primary : colors.border }]}><Text style={{ color: day === item.offset ? "#fff" : colors.muted, fontWeight: "750" }}>{item.label}</Text></Pressable>)}
    </ScrollView>
    <View style={styles.stats}>
      <Stat label="Total" value={filtered.length} color={colors.text} colors={colors} />
      <Stat label="Accepted" value={stats.OK || 0} color={colors.success} colors={colors} />
      <Stat label="Wrong" value={stats.WRONG_ANSWER || 0} color={colors.danger} colors={colors} />
      <Stat label="TLE" value={stats.TIME_LIMIT_EXCEEDED || 0} color="#d97706" colors={colors} />
    </View>
  </>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.nav, { borderBottomColor: colors.border }]}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}><Text style={[styles.backText, { color: colors.text }]}>‹</Text></Pressable><Text style={[styles.navTitle, { color: colors.text }]}>Submissions</Text><ThemeToggle /></View>
      {loading ? <ActivityIndicator size="large" color={colors.primary} style={styles.center} /> : error ? <ErrorState message={error} onRetry={() => fetchSubmissions()} colors={colors} /> :
      <FlatList data={filtered} keyExtractor={(item) => String(item.id)} ListHeaderComponent={header} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchSubmissions(true)} colors={[colors.primary]} tintColor={colors.primary} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>✓</Text><Text style={[styles.emptyTitle, { color: colors.text }]}>A quiet day so far</Text><Text style={[styles.emptyText, { color: colors.muted }]}>No submissions found for this date. Pick another day or start solving.</Text></View>}
        renderItem={({ item }) => <SubmissionCard item={item} colors={colors} />}
      />}
    </SafeAreaView>
  );
}

function SubmissionCard({ item, colors }) {
  const accepted = item.verdict === "OK"; const verdictColor = accepted ? colors.success : item.verdict === "WRONG_ANSWER" ? colors.danger : "#d97706";
  const link = `https://codeforces.com/problemset/problem/${item.problem.contestId}/${item.problem.index}`;
  return <Pressable onPress={() => Linking.openURL(link)} style={({ pressed }) => [styles.card, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
    <View style={styles.cardTop}><View style={{ flex: 1 }}><Text numberOfLines={2} style={[styles.problem, { color: colors.text }]}>{item.problem.name}</Text><Text style={[styles.problemId, { color: colors.primary }]}>#{item.problem.contestId}{item.problem.index} ↗</Text></View><View style={[styles.verdict, { backgroundColor: `${verdictColor}18` }]}><Text style={{ color: verdictColor, fontSize: 11, fontWeight: "850" }}>{formatVerdict(item.verdict)}</Text></View></View>
    <Text style={[styles.meta, { color: colors.muted }]}>Rating {item.problem.rating || "—"} · {relativeTime(item.creationTimeSeconds)}</Text>
    {!!item.problem.tags?.length && <View style={styles.tags}>{item.problem.tags.slice(0, 4).map((tag) => <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}><Text style={{ color: colors.muted, fontSize: 10 }}>{tag}</Text></View>)}</View>}
  </Pressable>;
}
function Stat({ label, value, color, colors }) { return <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={{ color, fontSize: 20, fontWeight: "850" }}>{value}</Text><Text style={{ color: colors.muted, fontSize: 10 }}>{label}</Text></View>; }
function ErrorState({ message, onRetry, colors }) { return <View style={styles.center}><Text style={styles.errorIcon}>!</Text><Text style={[styles.emptyTitle, { color: colors.text }]}>Something went wrong</Text><Text style={[styles.emptyText, { color: colors.muted }]}>{message}</Text><Pressable onPress={onRetry} style={[styles.retry, { backgroundColor: colors.primary }]}><Text style={{ color: "#fff", fontWeight: "800" }}>Try again</Text></Pressable></View>; }
function sameLocalDay(a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); }
function formatVerdict(value = "TESTING") { return value === "OK" ? "ACCEPTED" : value.replaceAll("_", " "); }
function relativeTime(seconds) { const mins = Math.floor((Date.now() / 1000 - seconds) / 60); if (mins < 1) return "just now"; if (mins < 60) return `${mins}m ago`; const hours = Math.floor(mins / 60); return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`; }

const styles = StyleSheet.create({
  safe: { flex: 1 }, nav: { minHeight: 62, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth }, back: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, backText: { fontSize: 35, lineHeight: 37 }, navTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40, gap: 12 }, heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginVertical: 6 }, eyebrow: { fontSize: 11, fontWeight: "850", letterSpacing: 1 }, pageTitle: { fontSize: 26, fontWeight: "850", marginTop: 3 }, analytics: { paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13 },
  days: { gap: 8, paddingVertical: 14 }, day: { borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 9 }, stats: { flexDirection: "row", gap: 7, marginBottom: 4 }, stat: { flex: 1, minHeight: 64, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", gap: 2 },
  card: { borderWidth: 1, borderRadius: 19, padding: 15, gap: 9 }, cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 }, problem: { fontSize: 16, lineHeight: 21, fontWeight: "800" }, problemId: { fontSize: 11, fontWeight: "750", marginTop: 4 }, verdict: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, maxWidth: 105 }, meta: { fontSize: 12 }, tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 }, tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  center: { flex: 1, padding: 30, alignItems: "center", justifyContent: "center" }, empty: { alignItems: "center", paddingVertical: 55, paddingHorizontal: 20 }, emptyIcon: { color: "#fff", backgroundColor: "#287D75", width: 48, height: 48, borderRadius: 16, textAlign: "center", textAlignVertical: "center", fontSize: 25, overflow: "hidden" }, errorIcon: { color: "#fff", backgroundColor: "#dc2626", width: 48, height: 48, borderRadius: 16, textAlign: "center", textAlignVertical: "center", fontSize: 28, fontWeight: "800", overflow: "hidden" }, emptyTitle: { fontSize: 19, fontWeight: "850", marginTop: 14 }, emptyText: { fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 }, retry: { borderRadius: 13, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 },
});
