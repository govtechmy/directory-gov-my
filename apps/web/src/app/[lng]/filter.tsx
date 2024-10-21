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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Search from "@/icons/search";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const searchPlaceholder = t("directory.dropdown.search_placeholder");
  const noData = t("table.no_data");

  const allValue = "ALL_VALUE";

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchQuery = searchParams.get(column);
  const [selectedFilters, setSelectedFilters] = useState<string>();

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
  // const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all the options in the dropdown, when the searchParams changes
    const fetchOptions = async () => {
      try {
        let ministryFilter = null;
        let divisionFilter = null;

        let dropdownArr: string[] = [];

        // get query params
        if (aggKey == "division_agg") {
          ministryFilter = searchParams.get("org_name");
        } else if (aggKey == "unit_agg") {
          ministryFilter = searchParams.get("org_name");
          divisionFilter = searchParams.get("division_name");
        }

        if (aggKey == "division_agg" && ministryFilter != null) {
          // Only want to fetch the division dropdown if the ministry filter is not null (save resources instead of fetch everytime)
          const { aggregations } = await filterDropdown(ministryFilter);
          dropdownArr = aggregations[aggKey as AggKey];
          setFilterArr(dropdownArr);
        } else if (
          aggKey == "unit_agg" &&
          ministryFilter != null &&
          divisionFilter != null
        ) {
          // Only want to fetch the unit dropdown if the ministry and division filter are not null (save resources instead of fetch everytime)
          const { aggregations } = await filterDropdown(
            ministryFilter,
            divisionFilter,
          );
          dropdownArr = aggregations[aggKey as AggKey];
          setFilterArr(dropdownArr);
        } else if (aggKey == "ministry_agg") {
          const { aggregations } = await filterDropdown();
          dropdownArr = aggregations[aggKey as AggKey];
          setFilterArr(dropdownArr);
        }

        if (!searchQuery || !dropdownArr) {
          setSelectedFilters(allValue);
        } else {
          // search query exists
          if (dropdownArr.includes(searchQuery)) {
            setSelectedFilters(searchQuery);
          } else {
            // searchQuery does not exists in the dropdown value (user temper)
            const params = new URLSearchParams(searchParams);
            if (column === "org_name") {
              // if the dropdown is for the ministry and the query params is invalid then delete from query params all three, then set the selection to 'all'
              params.delete("org_name");
              params.delete("division_name");
              params.delete("unit_name");
            } else if (column === "division_name") {
              // if the dropdown is for the division and the query params is invalid then delete from query params the division and unit value, then set the selection to 'all'
              params.delete("division_name");
              params.delete("unit_name");
            } else {
              // if the dropdown is for the unit and the query params is invalid then delete from query params the unit value, then set the selection to 'all'
              params.delete("unit_name");
            }
            replace(`${pathname}?${params.toString()}`, { scroll: false });
            setSelectedFilters(allValue);
          }
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, [searchParams]);

  // const filteredOptions = useMemo(() => {
  //   return filterArr.filter((option) =>
  //     option.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [filterArr, searchTerm]);

  const handleValueChange = (selected: string) => {
    searchArray(selected);
    setSelectedFilters(selected);
  };

  // return (
  //   <div className="pb-4">
  //     <Select
  //       value={selectedFilters}
  //       onValueChange={handleValueChange}
  //       disabled={
  //         (aggKey === "division_agg" &&
  //           searchParams.get("org_name") === null) ||
  //         (aggKey === "unit_agg" &&
  //           (searchParams.get("org_name") === null ||
  //             searchParams.get("division_name") === null))
  //       }
  //     >
  //       <SelectTrigger asChild>
  //         <Button variant="secondary">
  //           {selectedFilters !== allValue ? null : (
  //             <span className="text-sm text-dim-500">{subtitle}:</span>
  //           )}
  //           <SelectValue>
  //             {selectedFilters == allValue ? all : selectedFilters}
  //           </SelectValue>
  //           <SelectIcon>
  //             <ChevronDown />
  //           </SelectIcon>
  //         </Button>
  //       </SelectTrigger>
  //       <SelectContent
  //         avoidCollisions={true}
  //         side="bottom"
  //         className="max-h-[250px] w-full py-2"
  //         align="start"
  //       >
  //         <div className="px-2 pb-2">
  //           <input
  //             placeholder="Search..."
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             className="w-full"
  //           />
  //         </div>
  //         <SelectItem
  //           value={allValue}
  //           className={cn(
  //             "max-sm:w-[calc(100svw-40px)]",
  //             allValue === selectedFilters ? "font-medium" : "",
  //           )}
  //         >
  //           {all}
  //         </SelectItem>
  //         {filteredOptions.map((l) => (
  //           <SelectItem
  //             key={l}
  //             value={l}
  //             className={cn(
  //               "max-sm:w-[calc(100svw-40px)]",
  //               l === selectedFilters ? "font-medium" : "",
  //             )}
  //           >
  //             {l}
  //           </SelectItem>
  //         ))}
  //       </SelectContent>
  //     </Select>
  //   </div>
  // );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const truncateText = (text: string, maxLength: number) => {
    // console.log("text", text);
    return text?.length > maxLength
      ? text?.substring(0, maxLength) + "..."
      : text;
  };
  return (
    <div className="pb-4">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger
          asChild
          disabled={
            (aggKey === "division_agg" &&
              searchParams.get("org_name") === null) ||
            (aggKey === "unit_agg" &&
              (searchParams.get("org_name") === null ||
                searchParams.get("division_name") === null))
          }
        >
          <Button
            variant="secondary"
            className="max-w-[260px] justify-between bg-white"
          >
            <span className="text-sm text-dim-500 gap-[6px]">{subtitle}:</span>
            <span className="flex-grow">
              {selectedFilters == allValue
                ? all
                : truncateText(selectedFilters as string, 15)}
            </span>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[260px] p-0 bg-white">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <ScrollArea className="max-h-[185px] overflow-auto">
              <CommandList>
                <CommandEmpty>{noData}</CommandEmpty>
                <CommandGroup>
                  {filterArr.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={(currentValue) => {
                        handleValueChange(currentValue);
                        setOpen(false);
                      }}
                      className="hover:bg-washed-100 border-r-[4px]"
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
