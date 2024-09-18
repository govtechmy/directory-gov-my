"use client";
import { ThemeProvider } from "../../../node_modules/next-themes/dist/index";
import { ReactNode } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="selector" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
