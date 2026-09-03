import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { icons } from "../constants";

export default function Welcome({ userInfo, isLoading }) {
  const router = useRouter();
  const { colors } = useTheme();
  if (isLoading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 60 }} />;
  if (!userInfo) return <View style={styles.error}><Image source={icons.bhai_kya} resizeMode="contain" style={styles.errorImage} /><Text style={{ color: colors.muted }}>Enter a valid Codeforces handle.</Text></View>;

  const facts = [
    ["Country", userInfo.country || "Not provided"], ["Organization", userInfo.organization || "Independent"],
    ["Max rating", userInfo.maxRating || "—"], ["Max rank", userInfo.maxRank || "—"],
    ["Friends", userInfo.friendOfCount ?? "—"], ["Last seen", relativeTime(userInfo.lastOnlineTimeSeconds)],
  ];
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.profileRow}>
        <Image source={{ uri: userInfo.titlePhoto }} style={[styles.avatar, { borderColor: colors.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{[userInfo.firstName, userInfo.lastName].filter(Boolean).join(" ") || userInfo.handle}</Text>
          <Text style={[styles.handle, { color: colors.primary }]}>@{userInfo.handle}</Text>
          <Text style={[styles.rank, { color: rankColor(userInfo.rank, colors) }]}>{userInfo.rank} · {userInfo.rating || "unrated"}</Text>
        </View>
      </View>
      <View style={[styles.grid, { borderTopColor: colors.border }]}>
        {facts.map(([label, value]) => <View key={label} style={styles.fact}><Text style={[styles.factLabel, { color: colors.muted }]}>{label}</Text><Text numberOfLines={1} style={[styles.factValue, { color: colors.text }]}>{value}</Text></View>)}
      </View>
      <Pressable onPress={() => router.push({ pathname: "/SubmissionsScreen", params: { handle: userInfo.handle } })} style={[styles.action, { backgroundColor: colors.primarySoft }]}>
        <Text style={{ color: colors.primary, fontWeight: "850" }}>View submissions and analytics  →</Text>
      </Pressable>
    </View>
  );
}

function relativeTime(seconds) { if (!seconds) return "Unknown"; const mins = Math.floor((Date.now() / 1000 - seconds) / 60); if (mins < 1) return "Online"; if (mins < 60) return `${mins}m ago`; const hours = Math.floor(mins / 60); if (hours < 24) return `${hours}h ago`; return `${Math.floor(hours / 24)}d ago`; }
function rankColor(rank, colors) { if (!rank) return colors.muted; if (rank.includes("grandmaster")) return colors.danger; if (rank.includes("master")) return "#f97316"; if (rank === "expert") return "#3b82f6"; if (rank === "specialist") return "#0891b2"; if (rank === "pupil") return colors.success; return colors.muted; }

const styles = StyleSheet.create({
  card: { margin: 16, borderWidth: 1, borderRadius: 24, padding: 17, gap: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 }, avatar: { width: 76, height: 76, borderRadius: 24, borderWidth: 2 }, name: { fontSize: 20, fontWeight: "850" }, handle: { fontSize: 13, fontWeight: "700", marginTop: 2 }, rank: { fontSize: 12, fontWeight: "800", textTransform: "capitalize", marginTop: 5 },
  grid: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 14, flexDirection: "row", flexWrap: "wrap", rowGap: 13 }, fact: { width: "50%", paddingRight: 8 }, factLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.7 }, factValue: { fontSize: 13, fontWeight: "700", marginTop: 3 },
  action: { minHeight: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" }, error: { alignItems: "center", paddingVertical: 30 }, errorImage: { width: 240, height: 180 },
});
