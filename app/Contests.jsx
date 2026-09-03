import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ContestItem from "../components/ContestItem";
import { useTheme } from "../contexts/ThemeContext";

export default function Contests({ handle, refreshToken = 0, onLoadingChange }) {
  const { colors } = useTheme();
  const [contests, setContests] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);
    onLoadingChange?.(true);
    axios.get(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`)
      .then((response) => {
        if (!active) return;
        setContests(response.data.status === "OK" ? [...response.data.result].reverse() : []);
      })
      .catch(() => { if (active) { setContests([]); setError(true); } })
      .finally(() => { if (active) onLoadingChange?.(false); });
    return () => { active = false; onLoadingChange?.(false); };
  }, [handle, refreshToken, onLoadingChange]);

  const averageChange = useMemo(() => contests?.length
    ? contests.reduce((total, item) => total + item.newRating - item.oldRating, 0) / contests.length
    : 0, [contests]);

  if (!contests) return <ActivityIndicator style={{ marginVertical: 28 }} color={colors.primary} />;

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>PERFORMANCE</Text>
          <Text style={[styles.title, { color: colors.text }]}>Contest history</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{contests.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>contests</Text>
        </View>
      </View>
      <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={{ color: colors.muted }}>Average rating change</Text>
        <Text style={{ color: averageChange >= 0 ? colors.success : colors.danger, fontWeight: "850" }}>
          {averageChange >= 0 ? "+" : ""}{averageChange.toFixed(1)}
        </Text>
      </View>
      {error && <Text style={[styles.empty, { color: colors.danger }]}>Couldn’t refresh contest history.</Text>}
      {!error && contests.length === 0 && <Text style={[styles.empty, { color: colors.muted }]}>No rated contests yet.</Text>}
      {contests.map((item) => <ContestItem key={`${item.contestId}-${item.ratingUpdateTimeSeconds}`} item={item} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingBottom: 30, gap: 12 }, headingRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { fontSize: 10, fontWeight: "850", letterSpacing: 1.5 }, title: { fontSize: 23, fontWeight: "850", marginTop: 3 },
  stat: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, alignItems: "center" }, statValue: { fontSize: 16, fontWeight: "850" }, statLabel: { fontSize: 10 },
  summary: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: "row", justifyContent: "space-between" }, empty: { textAlign: "center", paddingVertical: 24 },
});
