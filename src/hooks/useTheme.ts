// import { useState, useEffect } from "react";
// import { Theme } from "../types/const";


// export function useTheme() {
//   const [theme, setThemeState] = useState<Theme>(Theme.LIGHT);

//   // Initialize theme from localStorage or system preference
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") as Theme | null;
    
//     if (storedTheme) {
//       setThemeState(storedTheme);
//       document.documentElement.classList.toggle(Theme.DARK, storedTheme === Theme.DARK);
//     } else {
//       // Follow system preference
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       const initialTheme = prefersDark ? Theme.DARK : Theme.LIGHT;
//       setThemeState(initialTheme);
//       document.documentElement.classList.toggle(Theme.DARK, prefersDark);
//     }
//   }, []);

//   // Toggle theme function
//   const toggleTheme = () => {
//     const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
//     setThemeState(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle(Theme.DARK, newTheme === Theme.DARK);
//   };

//   return { theme, toggleTheme };
// }

// src/hooks/useTheme.ts
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme: theme || "light",
    toggleTheme,
  };
}
