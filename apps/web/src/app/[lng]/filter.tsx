"use client";

import { FC, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ChevronDown from "@/icons/chevron-down";
import { useTranslation } from "@/i18n/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import { CommandList } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DirektoriFilterI {
  column: string;
  subtitle?: string;
  lng: string;
  disabled: boolean;
  items?: string[];
  selectedItem: string | null;
}

export const DirektoriFilter: FC<DirektoriFilterI> = ({
  column,
  subtitle,
  lng,
  disabled,
  items,
  selectedItem,
}) => {
  const { t } = useTranslation(lng);
  const all = t("directory.table_header.semua");
  const searchPlaceholder = t("directory.dropdown.search_placeholder");

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);

      if (key === "org") {
        params.delete("division");
        params.delete("subdivision");
      } else if (key === "division") params.delete("subdivision");

      return push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams],
  );

  return (
    <>
      <Popover>
        <PopoverTrigger
          asChild
          disabled={disabled}
          className="w-full sm:w-fit max-w-96"
        >
          <Button variant="secondary">
            <span className="text-sm text-dim-500">{subtitle}</span>
            <span className="grow truncate">
              {items?.find((e) => e === selectedItem) ?? all}
            </span>
            <ChevronDown filled className="fill-black-900 size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-background max-sm:w-[var(--radix-popover-trigger-width)]"
          align="start"
        >
          <Command className="gap-y-2">
            <CommandInput placeholder={searchPlaceholder} />
            <ScrollArea className="max-h-[240px] overflow-auto">
              <CommandList>
                <CommandItem
                  value="all"
                  onSelect={() => setSearchParams(column, "")}
                  className={cn(
                    "hover:bg-washed-100",
                    selectedItem == null && "bg-washed-100",
                  )}
                >
                  {all}
                </CommandItem>
                {items?.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={(currentValue) =>
                      setSearchParams(column, currentValue)
                    }
                    className={cn(
                      "hover:bg-washed-100",
                      selectedItem == item && "bg-washed-100",
                    )}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
