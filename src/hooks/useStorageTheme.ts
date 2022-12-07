import { useEffect, useState } from "react";
import { useTheme } from "react-daisyui";

export type Theme = "" | "light" | "dark";

const key = "theme";

export const useStorageTheme = () => {
  const { setTheme } = useTheme("");
  const [themeState, setThemeState] = useState<Theme>("");

  useEffect(() => {
    if (themeState) {
      setTheme(themeState);
      localStorage.setItem(key, themeState);
    } else {
      let strage = localStorage.getItem(key);
      setTheme(strage);
    }
  }, [themeState]);
  return { themeState, setThemeState };
};
