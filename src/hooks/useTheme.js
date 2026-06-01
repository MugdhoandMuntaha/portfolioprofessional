import { useState, useEffect } from "react";

export const themes = [
  { id: "indigo", label: "Cool Indigo", color: "bg-indigo-500" },
  { id: "emerald", label: "Emerald Mint", color: "bg-emerald-500" },
  { id: "sakura", label: "Sakura Rose", color: "bg-rose-500" },
  { id: "warm", label: "Amber Warmth", color: "bg-amber-500" },
  { id: "cyber", label: "Midnight Cyber", color: "bg-cyan-500" },
];

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "indigo";
    return localStorage.getItem("portfolio-theme") || "indigo";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all previous theme classes
    themes.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
