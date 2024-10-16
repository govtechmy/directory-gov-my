"use client";

import { FC, useState, useEffect, useMemo } from "react";
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
import { Aggregations, filterDropdown } from "./actions/filter-dropdown";

interface DirektoriFilterI {
  column: string;
  subtitle?: string;
  lng: string;
  aggKey: string;
}

type AggKey = keyof Aggregations;

export const DirektoriFilter: FC<DirektoriFilterI> = ({
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
  const [selectedFilters, setSelectedFilters] = useState<string>();

  useEffect(() => {
    setSelectedFilters(searchQuery || all);
  }, [searchQuery, all]);

  const searchArray = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query !== all) {
      params.set(column, query);
    } else {
      params.delete(column);
    }

    // to delete the children when reset
    if (column === "org_name") {
      params.delete("division_name");
      params.delete("unit_name");
    }
    if (column === "division_name") {
      params.delete("unit_name");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [filterArr, setFilterArr] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let ministryFilter = null;
        let divisionFilter = null;
        if (aggKey == "division_agg") {
          ministryFilter = searchParams.get("org_name");
        } else if (aggKey == "unit_agg") {
          ministryFilter = searchParams.get("org_name");
          divisionFilter = searchParams.get("division_name");
        }

        if (aggKey == "division_agg" && ministryFilter != null) {
          const { aggregations } = await filterDropdown(ministryFilter);
          setFilterArr(aggregations[aggKey as AggKey]);
        } else if (
          aggKey == "unit_agg" &&
          ministryFilter != null &&
          divisionFilter != null
        ) {
          const { aggregations } = await filterDropdown(
            ministryFilter,
            divisionFilter,
          );
          setFilterArr(aggregations[aggKey as AggKey]);
        } else if (aggKey == "ministry_agg") {
          const { aggregations } = await filterDropdown();
          setFilterArr(aggregations[aggKey as AggKey]);
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, [searchParams]);

  const filteredOptions = useMemo(() => {
    return filterArr.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [filterArr, searchTerm]);

  const handleValueChange = (selected: string) => {
    searchArray(selected);
    setSelectedFilters(selected);
  };

  return (
    <div className="pb-4">
      <Select
        value={selectedFilters}
        onValueChange={handleValueChange}
        disabled={
          (aggKey === "division_agg" &&
            searchParams.get("org_name") === null) ||
          (aggKey === "unit_agg" &&
            (searchParams.get("org_name") === null ||
              searchParams.get("division_name") === null))
        }
      >
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
          <div className="px-2 pb-2">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <SelectItem
            value={all}
            className={cn(
              "max-sm:w-[calc(100svw-40px)]",
              all === selectedFilters ? "font-medium" : "",
            )}
          >
            {all}
          </SelectItem>
          {filteredOptions.map((l, index) => (
            <SelectItem
              key={index} // changed to index because different division might have the same unit, eg SEKSYEN PENGURUSAN ASET
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
