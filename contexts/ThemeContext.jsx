import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

const THEME_KEY = "cp:theme";

const palettes = {
  light: {
    background: "#F7F8FA",
    surface: "#ffffff",
    surfaceAlt: "#E5F2F0",
    text: "#17202A",
    muted: "#68737D",
    border: "#E1E5E8",
    primary: "#287D75",
    primarySoft: "#DCEEEB",
    success: "#16a34a",
    danger: "#dc2626",
    line: "#83BDB6",
  },
  dark: {
    background: "#111318",
    surface: "#1B1E26",
    surfaceAlt: "#252938",
    text: "#F4F6FB",
    muted: "#A9B0C0",
    border: "#343947",
    primary: "#64C9BE",
    primarySoft: "#203B39",
    success: "#4ade80",
    danger: "#fb7185",
    line: "#426F6B",
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
