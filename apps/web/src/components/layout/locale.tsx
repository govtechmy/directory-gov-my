"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/i18n/settings";
import ChevronDown from "@/icons/chevron-down";
import Globe from "@/icons/globe";
import { SelectIcon } from "@radix-ui/react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Locale({ lng }: { lng: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onValueChange = (lng: string) => {
    startTransition(() => {
      router.replace(
        `${lng}${pathname.substring(6)}${searchParams ? `?${searchParams}` : ""}`,
        {
          scroll: false,
        },
      );
    });
  };

  const name: Record<"en-GB" | "ms-MY", { full: string; short: string }> = {
    "en-GB": {
      full: "English",
      short: "EN",
    },
    "ms-MY": {
      full: "Bahasa Melayu",
      short: "BM",
    },
  };

  return (
    <Select value={lng} onValueChange={onValueChange}>
      <SelectTrigger asChild>
        <Button variant="secondary">
          <Globe />
          <SelectValue>{name[lng as "en-GB" | "ms-MY"].short}</SelectValue>
          <SelectIcon>
            <ChevronDown className="size-4 -mx-0.5" filled />
          </SelectIcon>
        </Button>
      </SelectTrigger>
      <SelectContent align="end">
        {languages.map((l) => (
          <SelectItem key={l} value={l}>
            {name[l as "en-GB" | "ms-MY"].full}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
