"use client";

import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChevronDown from "@/icons/chevron-down";
import { useTranslation } from "@/i18n/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DirektoriFilterI {
  column: string;
  subtitle?: string;
  lng: string;
  aggKey: string;
  disabled: boolean;
  dropdownItems: string[];
  selectedItem: string | null;
  onChange: (
    org_name: string | null,
    division_name: string | null,
    unit_name: string | null,
  ) => void;
}

export const DirektoriFilter: FC<DirektoriFilterI> = ({
  column,
  subtitle,
  lng,
  aggKey,
  disabled,
  dropdownItems,
  selectedItem,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(lng);
  const allValue = "ALL_VALUE";
  const all = t("directory.table_header.semua");
  const searchPlaceholder = t("directory.dropdown.search_placeholder");
  const noData = t("table.no_data");
  return (
    <div className="pb-4">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {/* <PopoverTrigger asChild disabled={disabled} className="max-w-[260px]"> */}
        <PopoverTrigger
          asChild
          disabled={disabled}
          // className="w-full sm: max-w-[260px]"
          className="w-full sm:max-w-[260px] sm:w-auto"
        >
          <Button
            variant="secondary"
            className="justify-between bg-background/100 focus:ring-brand-600/20"
          >
            <span className="text-sm text-dim-500 gap-[6px]">{subtitle}</span>
            <span className="flex-grow truncate">
              {selectedItem == null ? all : selectedItem}
            </span>
            <ChevronDown filled={true} className="fill-black-900 size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          // className="p-0 bg-background border-none max-w-[260px]"
          className="p-0 bg-background border-none w-full sm:w-[260px]"
          align="start"
        >
          <Command className="border-outline-200 border shadow-context">
            <CommandInput placeholder={searchPlaceholder} />
            <ScrollArea className="max-h-[185px] overflow-auto mt-2">
              <CommandList>
                <CommandEmpty>{noData}</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={allValue}
                    value={allValue}
                    onSelect={() => {
                      // For allValue, so will pass allValue to the specific parameter, since it will not be present in the dropdown options that we have fetched. It will reset the column (and delete the query params)
                      if (aggKey == "ministry_agg") {
                        onChange(allValue, null, null);
                      } else if (aggKey == "division_agg") {
                        onChange(null, allValue, null);
                      } else if (aggKey == "unit_agg") {
                        onChange(null, null, allValue);
                      }
                      setOpen(false);
                    }}
                    className={cn(
                      "hover:bg-washed-100",
                      selectedItem == null && "bg-washed-100",
                    )}
                  >
                    {all}
                  </CommandItem>
                  {dropdownItems.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={(currentValue) => {
                        if (aggKey == "ministry_agg") {
                          onChange(currentValue, null, null);
                        } else if (aggKey == "division_agg") {
                          onChange(null, currentValue, null);
                        } else if (aggKey == "unit_agg") {
                          onChange(null, null, currentValue);
                        }
                        setOpen(false);
                      }}
                      className={cn(
                        "hover:bg-washed-100",
                        selectedItem == item && "bg-washed-100",
                      )}
                    >
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
