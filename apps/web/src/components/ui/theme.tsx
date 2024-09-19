"use client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/client";
import { useEffect, useState } from "react";
import Moon from "@/icons/moon";
import Sun from "@/icons/sun";
import { useTheme } from "next-themes";

export default function ThemeToggle({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isLightTheme = resolvedTheme === "light";

  return (
    <Button
      title={isLightTheme ? t("theme.toggle_dark") : t("theme.toggle_light")}
      variant="tertiary"
      size="icon"
      className="group"
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
    >
      <Moon
        data-state={isLightTheme ? "dark" : "light"}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 size-4 group-hover:text-black data-[state=dark]:flex data-[state=light]:hidden"
      />
      <Sun
        data-state={isLightTheme ? "dark" : "light"}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 -m-0.5 size-5 group-hover:text-[#FFFFFF] data-[state=light]:flex data-[state=dark]:hidden"
      />
      <div className="sr-only">
        {isLightTheme ? t("theme.toggle_dark") : t("theme.toggle_light")}
      </div>
    </Button>
  );
}
