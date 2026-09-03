import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Welcome from "../Welcome";
import Contests from "../Contests";
import SearchComponent from "../../components/SearchComponent";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import HandleSetup from "../../components/HandleSetup";

const HANDLE_KEY = "storedHandle";

export default function Codeforces() {
  const { colors } = useTheme();
  const [userInfo, setUserInfo] = useState(null);
  const [handle, setHandle] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [contestRefreshing, setContestRefreshing] = useState(false);

  const fetchProfile = useCallback(async (nextHandle) => {
    if (!nextHandle) return;
    setLoading(true);
    setUserInfo(null);
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(nextHandle)}&checkHistoricHandles=false`);
      if (response.data.status === "OK") {
        setUserInfo(response.data.result[0]);
        AsyncStorage.setItem(HANDLE_KEY, nextHandle).catch(() => {});
      } else setUserInfo(null);
    } catch { setUserInfo(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(HANDLE_KEY).then((saved) => setHandle(saved || null)).catch(() => setHandle(null)).finally(() => setInitialized(true));
  }, []);
  useEffect(() => { if (initialized && handle) fetchProfile(handle); }, [fetchProfile, handle, initialized]);
  const onContestLoading = useCallback((value) => setContestRefreshing(value), []);
  const refresh = async () => {
    if (!handle) return;
    setRefreshToken((value) => value + 1);
    await fetchProfile(handle);
  };
  const resetHandle = () => Alert.alert(
    "Reset saved handle?",
    "You’ll return to handle setup and can choose a new default.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem(HANDLE_KEY).catch(() => {});
        setUserInfo(null);
        setHandle(null);
        setContestRefreshing(false);
      } },
    ]
  );

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemeToggle />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Codeforces</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{userInfo ? `${userInfo.handle} · ${userInfo.rank}` : "Profile, ratings and contests"}</Text>
        </View>
        {userInfo && <View style={[styles.rating, { backgroundColor: colors.primarySoft }]}><Text style={[styles.ratingText, { color: colors.primary }]}>{userInfo.rating || "—"}</Text></View>}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading || contestRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}
      >
        {!initialized ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 80 }} /> : !handle ?
          <HandleSetup onSubmit={setHandle} /> : <>
          <Welcome userInfo={userInfo} isLoading={loading} />
          <SearchComponent onSearch={setHandle} />
          {userInfo && <Pressable onPress={resetHandle} style={({ pressed }) => [styles.reset, { borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}><Text style={{ color: colors.muted, fontSize: 12, fontWeight: "750" }}>Reset saved handle</Text></Pressable>}
          {userInfo && <Contests handle={handle} refreshToken={refreshToken} onLoadingChange={onContestLoading} />}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 }, header: { minHeight: 68, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 23, fontWeight: "850", letterSpacing: -0.4 }, subtitle: { fontSize: 11, marginTop: 2 },
  rating: { minWidth: 58, height: 40, borderRadius: 13, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }, ratingText: { fontSize: 14, fontWeight: "850" },
  content: { paddingTop: 8, paddingBottom: 30 }, reset: { alignSelf: "flex-end", marginHorizontal: 16, marginTop: -10, marginBottom: 16, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 8 },
});
