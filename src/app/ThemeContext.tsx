// src/app/ThemeContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  modoOscuro: boolean;
  toggleModoOscuro: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modoOscuro, setModoOscuro] = useState(false);

  // 🔹 Cargar preferencia guardada
  useEffect(() => {
    const savedTheme = localStorage.getItem("modoOscuro");
    if (savedTheme) setModoOscuro(savedTheme === "true");
  }, []);

  // 🔹 Guardar cada vez que cambie
  useEffect(() => {
    localStorage.setItem("modoOscuro", String(modoOscuro));
  }, [modoOscuro]);

  const toggleModoOscuro = () => setModoOscuro((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ modoOscuro, toggleModoOscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
}
