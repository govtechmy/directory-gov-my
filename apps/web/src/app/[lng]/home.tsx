"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColumnDef } from "@tanstack/react-table";
import Hero from "@/components/layout/hero";
import Section from "@/components/layout/section";
import DataTable from "../../components/ui/data-table";
import Search from "@/components/ui/search";
import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import { DirektoriFilter } from "./filter";
import { useEffect, useState } from "react";
import { filterDropdown } from "./actions/filter-dropdown";

interface Kakitangan {
  org_sort: number;
  org_id: string;
  org_name: string;
  org_type: string;
  division_sort: number;
  division_name: string | null;
  unit_name: string | null;
  person_name: string | null;
  position: string | null;
  person_phone: string | null;
  person_email: string | null;
  person_fax: string | null;
  parent_org_id: string | null;
  person_sort: number;
  // grade: string | null;
}

export default function Home({
  lng,
  kakitangan,
  totalPages,
}: {
  lng: string;
  kakitangan: Kakitangan[];
  totalPages: number;
}) {
  const { t } = useTranslation(lng);
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const orgNameSelected = searchParams.get("org_name");
  const divisionNameSelected = searchParams.get("division_name");
  const unitNameSelected = searchParams.get("unit_name");

  const column: ColumnDef<Kakitangan>[] = [
    {
      header: t("directory.table_header.nama"),
      accessorKey: "person_name",
      id: "person_name",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        headerClass: "border-r sticky bg-background left-0 z-10",
        cellClass: "border-r sticky bg-background left-0 z-10",
      },
    },
    {
      header: t("directory.table_header.jawatan"),
      accessorKey: "position",
      id: "position",
      cell: (row) => row.getValue(),
      meta: {
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.kementerian"),
      accessorKey: "org_name",
      id: "org_name",
      cell: (row) => row.getValue(),
      meta: {
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.bhg"),
      accessorKey: "division_name",
      id: "division_name",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.seksyen"),
      accessorKey: "unit_name",
      id: "unit_name",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        expandable: true,
      },
    },
    // {
    //   header: t("directory.table_header.gred"),
    //   accessorKey: "grade",
    //   id: "grade",
    //   cell: (row) => row.getValue() ?? "—",
    // },
    {
      header: t("directory.table_header.telefon"),
      accessorKey: "person_phone",
      id: "person_phone",
      cell: (row) => row.getValue() ?? "—",
    },
    {
      header: t("directory.table_header.fax"),
      accessorKey: "person_fax",
      id: "person_fax",
      cell: (row) => row.getValue() ?? "—",
    },
    {
      header: t("directory.table_header.emel"),
      accessorKey: "person_email",
      id: "person_email",
      cell: (row) => row.getValue() ?? "—",
    },
  ];

  const mobileColumn: ColumnDef<Kakitangan>[] = [
    {
      header: "",
      accessorKey: "division_name",
      id: "division_name",
      cell: ({ row }) => {
        const {
          division_name,
          unit_name,
          person_name,
          position,
          person_phone,
          person_fax,
          person_email,
        } = row.original;

        return (
          <div className="space-y-2 font-medium text-dim-500">
            <p className="text-balance text-xs font-semibold">
              {division_name}
            </p>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-x-1.5">
                <span className="text-base font-semibold text-foreground">
                  {person_name ?? "—"}
                </span>
              </div>
              <p className="text-black-700">{position}</p>
            </div>

            {person_phone || person_email ? (
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {person_phone && (
                  <>
                    <Phone className="text-outline-400" />
                    <span>{person_phone}</span>
                  </>
                )}
                {person_phone && person_email ? "|" : ""}
                {person_email && (
                  <div className="flex items-center gap-x-1.5">
                    <Envelope className="text-outline-400" />
                    <span>{person_email}</span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  const searchArray = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query.toLowerCase());
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  type DropdownItems = {
    org_name: string[];
    division_name: string[];
    unit_name: string[];
  };

  const allValue = "ALL_VALUE";

  const [dropdownItems, setDropdownItems] = useState<DropdownItems>({
    org_name: [],
    division_name: [],
    unit_name: [],
  });

  const resetSearchQuery = (
    org_name: string | null,
    division_name: string | null,
    unit_name: string | null,
  ) => {
    const params = new URLSearchParams(searchParams);
    // This is required as the user can only pass one selectedItem per dropdown at once
    if (!org_name) {
      org_name = orgNameSelected;
    }
    if (!division_name) {
      division_name = divisionNameSelected;
    }
    if (!unit_name) {
      unit_name = unitNameSelected;
    }

    // check for valid query params
    const validItem = checkValidItem(org_name, division_name, unit_name);

    // delete or set the query params depends on the validity of the params
    if (!org_name || !validItem.orgNameCheck) {
      params.delete("org_name");
    } else {
      params.set("org_name", org_name);
    }

    if (!division_name || !validItem.divisionNameCheck) {
      params.delete("division_name");
    } else {
      params.set("division_name", division_name);
    }
    if (!unit_name || !validItem.unitNameCheck) {
      params.delete("unit_name");
    } else {
      params.set("unit_name", unit_name);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const checkValidItem = (
    org_name: string | null,
    division_name: string | null,
    unit_name: string | null,
  ) => {
    let orgNameCheck = false;
    let divisionNameCheck = false;
    let unitNameCheck = false;
    const orgNameDropdown = dropdownItems.org_name;
    const divisionNameDropdown = dropdownItems.division_name;
    const unitNameDropdown = dropdownItems.unit_name;

    if (org_name) {
      orgNameCheck = orgNameDropdown.includes(org_name);
    }
    if (division_name) {
      divisionNameCheck = divisionNameDropdown.includes(division_name);
    }
    if (unit_name) {
      unitNameCheck = unitNameDropdown.includes(unit_name);
    }

    // to reset the division and unit when the user tempers the query params such that it inputs values that are not present in the dropdown
    // the idea is that for example, if the ministry value is invalid, that is orgNameCheck is false, then division value and unit value will be reset as well. So, the reset is downwards in hierachy
    if (orgNameCheck == false) {
      divisionNameCheck = false;
    }
    if (divisionNameCheck == false) {
      unitNameCheck = false;
    }

    // to check for valid dropdowns present
    if (unit_name && (!division_name || !org_name)) {
      // if the dropdown only has unitName, but no ministryName and divisionName, will reset all
      orgNameCheck = false;
      divisionNameCheck = false;
      unitNameCheck = false;
    }
    if (division_name && !org_name) {
      // if the dropdown only has divisionName, but no ministryName will reset all
      orgNameCheck = false;
      divisionNameCheck = false;
      unitNameCheck = false;
    }

    return { orgNameCheck, divisionNameCheck, unitNameCheck };
  };

  // Fetch ministry dropdown options (on mount) only
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const { aggregations } = await filterDropdown();
        const dropdownArr = aggregations["ministry_agg"];
        setDropdownItems((prev) => ({ ...prev, org_name: dropdownArr }));
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchDropdownOptions();
  }, []);

  // Fetch division dropdown options when ministry selection changes
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      if (orgNameSelected) {
        try {
          const { aggregations } = await filterDropdown(orgNameSelected);
          const dropdownArr = aggregations["division_agg"];
          setDropdownItems((prev) => ({ ...prev, division_name: dropdownArr }));
        } catch (error) {
          console.error("Error fetching dropdown options:", error);
        }
      }
    };

    fetchDropdownOptions();
  }, [orgNameSelected]);

  // Fetch unit dropdown options when division selection changes
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      if (orgNameSelected && divisionNameSelected) {
        try {
          const { aggregations } = await filterDropdown(
            orgNameSelected,
            divisionNameSelected,
          );
          const dropdownArr = aggregations["unit_agg"];
          setDropdownItems((prev) => ({ ...prev, unit_name: dropdownArr }));
        } catch (error) {
          console.error("Error fetching dropdown options:", error);
        }
      }
    };

    fetchDropdownOptions();
  }, [divisionNameSelected]);

  // on every render will check if query params are valid and reset query params if applicable
  resetSearchQuery(orgNameSelected, divisionNameSelected, unitNameSelected);

  return (
    <main>
      <Hero
        title={t("directory.header")}
        search={
          <Search
            onChange={searchArray}
            placeholder={t("directory.search_placeholder")}
            defaultValue={searchQuery || ""}
            lng={lng}
          />
        }
      />

      <Section>
        <div className="w-full border-washed-100 py-12 lg:border-x lg:px-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="w-full sm:max-w-[260px] sm:w-auto">
              <DirektoriFilter
                lng={lng}
                column="org_name"
                subtitle={t("directory.table_header.kementerian")}
                aggKey="ministry_agg"
                disabled={dropdownItems.org_name?.length == 0}
                dropdownItems={dropdownItems.org_name}
                selectedItem={orgNameSelected}
                onChange={resetSearchQuery}
              />
            </div>

            <div className="flex flex-row gap-3 sm:gap-4 sm:w-auto w-full">
              <div className="w-[calc(50%-6px)] sm:max-w-[260px] ">
                <DirektoriFilter
                  lng={lng}
                  column="division_name"
                  subtitle={t("directory.table_header.bhg")}
                  aggKey="division_agg"
                  disabled={
                    dropdownItems.division_name?.length == 0 || !orgNameSelected
                  }
                  dropdownItems={dropdownItems.division_name}
                  selectedItem={divisionNameSelected}
                  onChange={resetSearchQuery}
                />
              </div>

              <div className="w-[calc(50%-6px)] sm:max-w-[260px] ">
                <DirektoriFilter
                  lng={lng}
                  column="unit_name"
                  subtitle={t("directory.table_header.seksyen")}
                  aggKey="unit_agg"
                  disabled={
                    dropdownItems.unit_name?.length == 0 ||
                    !orgNameSelected ||
                    !divisionNameSelected
                  }
                  dropdownItems={dropdownItems.unit_name}
                  selectedItem={unitNameSelected}
                  onChange={resetSearchQuery}
                />
              </div>
            </div>
          </div>
          <DataTable
            lng={lng}
            columns={isMobile ? mobileColumn : column}
            data={kakitangan}
            resizable={false}
            paginate={{
              pageIndex: 0,
              pageSize: 20,
            }}
            isMobile={isMobile}
          />
        </div>
      </Section>
    </main>
  );
}
