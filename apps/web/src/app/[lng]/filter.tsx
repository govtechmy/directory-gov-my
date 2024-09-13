"use client";

import { Header, Table as TTable } from "@tanstack/react-table";
import { FC, useState, useMemo } from "react";
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

interface DirektoriFilter {
  table: TTable<any>;
  headers: Header<any, unknown>[];
  column: string;
  subtitle?: string;
  lng: string;
}

export const DirektoriFilter: FC<DirektoriFilter> = ({
  table,
  headers,
  column,
  subtitle,
  lng,
}) => {
  const { t } = useTranslation(lng);
  const all = t("directory.table_header.semua");

  const header = headers.find((h) => h.id === column)!;
  const { getFacetedUniqueValues, getFilterValue, setFilterValue } =
    header.column;

  const [selectedFilters, setSelectedFilters] = useState<string>(
    (getFilterValue() as string) || all
  );

  const sortedUniqueValues = useMemo(() => {
    const uniqueValues = Array.from(getFacetedUniqueValues().keys());
    const filteredValues = uniqueValues.filter((value) => {
      if (!Boolean(value)) return false;
      return value;
    });
    return filteredValues.sort((a, b) => b.bhg - a.bhg);
  }, [getFacetedUniqueValues()]);

  const handleValueChange = (selected: string) => {
    setSelectedFilters(selected);

    if (selected === all) {
      table.resetColumnFilters(true);
      return;
    }
    setFilterValue(selected);
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
              all === selectedFilters ? "font-medium" : ""
            )}
          >
            {all}
          </SelectItem>
          {sortedUniqueValues.map((l) => (
            <SelectItem
              key={l}
              value={l}
              className={cn(
                "max-sm:w-[calc(100svw-40px)]",
                l === selectedFilters ? "font-medium" : ""
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
