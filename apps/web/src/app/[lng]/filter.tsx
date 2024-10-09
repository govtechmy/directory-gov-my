"use client";

import { FC, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChevronDown from "@/icons/chevron-down";
import { SelectIcon } from "@radix-ui/react-select";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { filterDropdown } from "./actions/filter-dropdown";

interface DirektoriFilter {
  column: string;
  subtitle?: string;
  lng: string;
  aggKey: string;
}

export const DirektoriFilter: FC<DirektoriFilter> = ({
  column,
  subtitle,
  lng,
  aggKey,
}) => {
  const { t } = useTranslation(lng);
  const all = t("directory.table_header.semua");

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchQuery = searchParams.get(column);
  const [selectedFilters, setSelectedFilters] = useState<string>(() => {
    if (searchQuery) {
      return searchQuery;
    } else {
      return all;
    }
  });

  const searchArray = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query !== all) {
      params.set(column, query.toLowerCase());
    } else {
      params.delete(column);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [filterArr, setFilterArr] = useState<string[]>([]);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { aggregations } = await filterDropdown();
        setFilterArr(aggregations[aggKey]);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleValueChange = (selected: string) => {
    searchArray(selected);
    setSelectedFilters(selected);
    // TODO: check if setSelectedFilters and selectedFilters are needed
  };

  return (
    <div className="pb-4">
      <Select value={selectedFilters} onValueChange={handleValueChange}>
        <SelectTrigger asChild>
          <Button variant="secondary">
            {selectedFilters !== all ? null : (
              <span className="text-sm text-dim-500">{subtitle}:</span>
            )}
            <SelectValue>{selectedFilters}</SelectValue>
            <SelectIcon>
              <ChevronDown />
            </SelectIcon>
          </Button>
        </SelectTrigger>
        <SelectContent
          avoidCollisions={true}
          side="bottom"
          className="max-h-[250px] w-full py-2"
          align="start"
        >
          <SelectItem
            value={all}
            className={cn(
              "max-sm:w-[calc(100svw-40px)]",
              all === selectedFilters ? "font-medium" : "",
            )}
          >
            {all}
          </SelectItem>
          {filterArr.map((l) => (
            <SelectItem
              key={l}
              value={l}
              className={cn(
                "max-sm:w-[calc(100svw-40px)]",
                l === selectedFilters ? "font-medium" : "",
              )}
            >
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
