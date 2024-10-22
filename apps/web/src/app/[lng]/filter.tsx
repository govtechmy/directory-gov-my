"use client";

import { FC, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ChevronDown from "@/icons/chevron-down";
import { useTranslation } from "@/i18n/client";
import { Aggregations, filterDropdown } from "./actions/filter-dropdown";
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
  // const [selectedItem, setselectedItem] = useState<string>();
  // const [dropdownOptions, setdropdownOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const { t } = useTranslation(lng);
  const allValue = "ALL_VALUE";
  const all = t("directory.table_header.semua");
  const searchPlaceholder = t("directory.dropdown.search_placeholder");
  const noData = t("table.no_data");

  // const searchParams = useSearchParams();
  // const { replace } = useRouter();
  // const pathname = usePathname();
  // const searchQuery = searchParams.get(column);

  // const resetSearchQuery = (query: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (query !== all) {
  //     params.set(column, query);
  //   } else {
  //     params.delete(column);
  //   }

  //   // to delete the children when the parent dropdown changes
  //   if (column === "org_name") {
  //     params.delete("division_name");
  //     params.delete("unit_name");
  //   }
  //   if (column === "division_name") {
  //     params.delete("unit_name");
  //   }
  //   replace(`${pathname}?${params.toString()}`, { scroll: false });
  // };

  // useEffect(() => {
  //   // Fetch all the options in the dropdown, when the searchParams changes
  //   const fetchOptions = async () => {
  //     try {
  //       let ministryFilter = null;
  //       let divisionFilter = null;
  //       let dropdownArr: string[] = [];

  //       // get query params
  //       // do it onChange (pass the stateSetter down)
  //       if (aggKey == "division_agg") {
  //         ministryFilter = searchParams.get("org_name");
  //       } else if (aggKey == "unit_agg") {
  //         ministryFilter = searchParams.get("org_name");
  //         divisionFilter = searchParams.get("division_name");
  //       }

  //       // kinda want to make the fetching in the home page as well, to make the component dumber
  //       // jadi basically, the dropdown will receive 2 more props: dropdown values and select and selectSetter
  //       // The way I can see is, maybe has 2 useEffect outside: for queryParams, for dataFetching
  //       if (aggKey == "division_agg" && ministryFilter != null) {
  //         // Only want to fetch the division dropdown if the ministry filter is not null (save resources instead of fetch everytime)
  //         const { aggregations } = await filterDropdown(ministryFilter);
  //         dropdownArr = aggregations[aggKey as AggKey];
  //         setdropdownOptions(dropdownArr);
  //       } else if (
  //         aggKey == "unit_agg" &&
  //         ministryFilter != null &&
  //         divisionFilter != null
  //       ) {
  //         // Only want to fetch the unit dropdown if the ministry and division filter are not null (save resources instead of fetch everytime)
  //         const { aggregations } = await filterDropdown(
  //           ministryFilter,
  //           divisionFilter,
  //         );
  //         dropdownArr = aggregations[aggKey as AggKey];
  //         setdropdownOptions(dropdownArr);
  //       } else if (aggKey == "ministry_agg") {
  //         const { aggregations } = await filterDropdown();
  //         dropdownArr = aggregations[aggKey as AggKey];
  //         setdropdownOptions(dropdownArr);
  //       }

  //       // Should i do with onChange as well?
  //       if (!searchQuery || !dropdownArr) {
  //         setselectedItem(allValue);
  //       } else {
  //         // search query exists
  //         if (dropdownArr.includes(searchQuery)) {
  //           setselectedItem(searchQuery);
  //         } else {
  //           // searchQuery does not exists in the dropdown value (user temper)
  //           const params = new URLSearchParams(searchParams);
  //           if (column === "org_name") {
  //             // if the dropdown is for the ministry and the query params is invalid then delete from query params all three, then set the selection to 'all'
  //             params.delete("org_name");
  //             params.delete("division_name");
  //             params.delete("unit_name");
  //           } else if (column === "division_name") {
  //             // if the dropdown is for the division and the query params is invalid then delete from query params the division and unit value, then set the selection to 'all'
  //             params.delete("division_name");
  //             params.delete("unit_name");
  //           } else {
  //             // if the dropdown is for the unit and the query params is invalid then delete from query params the unit value, then set the selection to 'all'
  //             params.delete("unit_name");
  //           }
  //           replace(`${pathname}?${params.toString()}`, { scroll: false });
  //           setselectedItem(allValue);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching dropdown options:", error);
  //     }
  //   };

  //   fetchOptions();
  // }, [searchParams]);

  // const handleValueChange = (selected: string) => {
  //   resetSearchQuery(selected);
  //   setselectedItem(selected);
  // };

  const truncateText = (text: string, maxLength: number) => {
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
            className="w-fit max-w-[260px] justify-between bg-white focus:ring-brand-600/20"
          >
            <span className="text-sm text-dim-500 gap-[6px]">{subtitle}</span>
            <span className="flex-grow">
              {selectedItem == allValue
                ? all
                : truncateText(selectedItem as string, 15)}
            </span>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit max-w-[260px] p-0 bg-white">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <ScrollArea className="max-h-[185px] overflow-auto mt-2">
              <CommandList>
                <CommandEmpty>{noData}</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={allValue}
                    value={allValue}
                    onSelect={(currentValue) => {
                      handleValueChange(currentValue);
                      setOpen(false);
                    }}
                    className="hover:bg-washed-100"
                  >
                    {all}
                  </CommandItem>
                  {dropdownOptions.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={(currentValue) => {
                        handleValueChange(currentValue);
                        setOpen(false);
                      }}
                      className="hover:bg-washed-100"
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
