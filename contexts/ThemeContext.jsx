import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

const THEME_KEY = "cp:theme";

const palettes = {
  light: {
    background: "#f5f7fb",
    surface: "#ffffff",
    surfaceAlt: "#eef2ff",
    text: "#172033",
    muted: "#667085",
    border: "#dfe4ee",
    primary: "#6366f1",
    primarySoft: "#e0e7ff",
    success: "#16a34a",
    danger: "#dc2626",
    line: "#a5b4fc",
  },
  dark: {
    background: "#111318",
    surface: "#1b1e26",
    surfaceAlt: "#252938",
    text: "#f4f6fb",
    muted: "#a9b0c0",
    border: "#343947",
    primary: "#8b8ff7",
    primarySoft: "#30345a",
    success: "#4ade80",
    danger: "#fb7185",
    line: "#606796",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme();
  const [mode, setMode] = useState(systemTheme === "dark" ? "dark" : "light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === "light" || saved === "dark") setMode(saved);
    });
  }, []);

  const toggleTheme = () => {
    setMode((current) => {
      const next = current === "dark" ? "light" : "dark";
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ mode, isDark: mode === "dark", colors: palettes[mode], toggleTheme }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
