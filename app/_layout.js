import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

function Navigation() {
    const { isDark, colors } = useTheme();
    return (
        <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack initialRouteName="(tabs)" screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="question/[slug]" options={{ headerShown: false }} />
        </Stack>
        </>
    )
}

export default function Layout() {
    return <ThemeProvider><Navigation /></ThemeProvider>;
}
