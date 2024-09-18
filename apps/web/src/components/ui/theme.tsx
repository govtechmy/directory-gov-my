"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/client";
import { useTheme } from "../../../node_modules/next-themes/dist/index";
import { useEffect, useState } from "react";
import Moon from "@/icons/moon";
import Sun from "@/icons/sun";

export default function ThemeToggle({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Button
      title={t("toggle_theme")}
      variant="tertiary"
      size="icon"
      className="group"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Moon
        data-state={resolvedTheme === "light" ? "dark" : "light"}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 size-4 group-hover:text-black data-[state=dark]:flex data-[state=light]:hidden"
      />
      <Sun
        data-state={resolvedTheme === "light" ? "dark" : "light"}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 -m-0.5 size-5 group-hover:text-[#FFFFFF] data-[state=light]:flex data-[state=dark]:hidden"
      />
      <div className="sr-only">
        {theme === "light" ? t("toggle_dark") : t("toggle_light")}
      </div>
    </Button>
  );
}
