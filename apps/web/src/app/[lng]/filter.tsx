"use client";

import { FC, useState } from "react";
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

interface DirektoriFilterI {
  subtitle?: string;
  lng: string;
  disabled: boolean;
  items?: string[];
  selectedItem: string | null;
  onChange: (param: string | null) => void;
}

export const DirektoriFilter: FC<DirektoriFilterI> = ({
  subtitle,
  lng,
  disabled,
  items,
  selectedItem,
  onChange,
}) => {
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  const all = t("directory.table_header.semua");

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
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
            <CommandInput
              placeholder={t("directory.dropdown.search_placeholder")}
            />
            <ScrollArea className="max-h-[240px] overflow-auto">
              <CommandList>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    setOpen(!open);
                    onChange(null);
                  }}
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
                    onSelect={(currentValue) => {
                      setOpen(!open);
                      onChange(currentValue);
                    }}
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
