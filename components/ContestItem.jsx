import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ContestItem({ item }) {
  const { colors } = useTheme();
  const change = item.newRating - item.oldRating;
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <Text numberOfLines={2} style={[styles.name, { color: colors.text }]}>{item.contestName}</Text>
        <View style={[styles.change, { backgroundColor: change >= 0 ? `${colors.success}18` : `${colors.danger}18` }]}>
          <Text style={{ color: change >= 0 ? colors.success : colors.danger, fontWeight: "850" }}>{change >= 0 ? "+" : ""}{change}</Text>
        </View>
      </View>
      <Text style={[styles.meta, { color: colors.muted }]}>{relativeTime(item.ratingUpdateTimeSeconds)} · Rank #{item.rank}</Text>
      <View style={[styles.ratingRow, { borderTopColor: colors.border }]}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Rating</Text>
        <Text style={{ color: colors.text, fontWeight: "750" }}>{item.oldRating}  →  {item.newRating}</Text>
      </View>
    </View>
  );
}

function relativeTime(seconds) {
  const elapsed = Math.max(0, Math.floor(Date.now() / 1000) - seconds);
  const units = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "min"]];
  for (const [size, label] of units) if (elapsed >= size) { const value = Math.floor(elapsed / size); return `${value} ${label}${value === 1 ? "" : "s"} ago`; }
  return "just now";
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 19, padding: 16, gap: 10, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 }, name: { flex: 1, fontSize: 16, lineHeight: 21, fontWeight: "800" },
  change: { minWidth: 52, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 6, alignItems: "center" }, meta: { fontSize: 12 },
  ratingRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
});
