import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

function Navigation() {
    const { isDark, colors } = useTheme();
    return (
        <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack initialRouteName="(tabs)" screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="question/[slug]" options={{ headerShown: false }} />
            <Stack.Screen name="SubmissionsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Analytics" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        </>
    )
}

export default function Layout() {
    return <SafeAreaProvider><ThemeProvider><Navigation /></ThemeProvider></SafeAreaProvider>;
}

export function ErrorBoundary({ error, retry }) {
    return (
        <View style={errorStyles.screen}>
            <Text style={errorStyles.badge}>!</Text>
            <Text style={errorStyles.title}>The app hit a snag</Text>
            <Text style={errorStyles.message}>{error?.message || "An unexpected error occurred."}</Text>
            <Pressable onPress={retry} style={errorStyles.button}><Text style={errorStyles.buttonText}>Try again</Text></Pressable>
        </View>
    );
}

const errorStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F7F8FA", alignItems: "center", justifyContent: "center", padding: 30 },
    badge: { width: 50, height: 50, borderRadius: 16, overflow: "hidden", textAlign: "center", textAlignVertical: "center", backgroundColor: "#dc2626", color: "#fff", fontSize: 30, fontWeight: "800" },
    title: { color: "#16302D", fontSize: 23, fontWeight: "800", marginTop: 16 },
    message: { color: "#607773", textAlign: "center", lineHeight: 20, marginTop: 8 },
    button: { backgroundColor: "#287D75", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13, marginTop: 20 },
    buttonText: { color: "#fff", fontWeight: "800" },
});
