"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: "class";
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme, enableSystem: boolean): ResolvedTheme {
  if (theme === "system" && enableSystem) {
    return getSystemTheme();
  }

  return theme === "dark" ? "dark" : "light";
}

function setDocumentTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  attribute = "class",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light");

  React.useEffect(() => {
    if (attribute !== "class") {
      return;
    }

    let storedTheme: Theme | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") {
        storedTheme = raw;
      }
    } catch {}

    const nextTheme = storedTheme ?? defaultTheme;
    const nextResolved = resolveTheme(nextTheme, enableSystem);
    setThemeState(nextTheme);
    setResolvedTheme(nextResolved);
    setDocumentTheme(nextResolved);
  }, [attribute, defaultTheme, enableSystem]);

  React.useEffect(() => {
    if (!enableSystem || theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const nextResolved = media.matches ? "dark" : "light";
      setResolvedTheme(nextResolved);
      setDocumentTheme(nextResolved);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [enableSystem, theme]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      const apply = () => {
        setThemeState(nextTheme);
        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {}

        const nextResolved = resolveTheme(nextTheme, enableSystem);
        setResolvedTheme(nextResolved);
        setDocumentTheme(nextResolved);
      };

      if (!disableTransitionOnChange) {
        apply();
        return;
      }

      const style = document.createElement("style");
      style.appendChild(
        document.createTextNode(
          "*,*::before,*::after{transition:none!important;animation:none!important}",
        ),
      );
      document.head.appendChild(style);
      apply();
      window.getComputedStyle(document.body);
      window.setTimeout(() => {
        style.remove();
      }, 1);
    },
    [disableTransitionOnChange, enableSystem],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
