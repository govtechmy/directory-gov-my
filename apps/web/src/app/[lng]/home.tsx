"use client";

import { useMemo } from "react";
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

interface Directory {
  org_sort: number;
  org_id: string;
  org_name: string;
  org_type: string;
  division_sort: number;
  division_name: string | null;
  unit_name: string | null;
  person_name: string | null;
  person_position: string | null;
  person_phone: string | null;
  person_email: string | null;
  person_fax: string | null;
  parent_org_id: string | null;
  person_sort: number;
}

export default function Home({
  lng,
  dataES,
}: {
  lng: string;
  dataES: Directory[];
}) {
  const { t } = useTranslation(lng);
  const { replace } = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  let list = dataES;
  const searchQuery = searchParams.get("search");

  const column: ColumnDef<Directory>[] = [
    {
      header: t("directory.table_header.nama"),
      accessorKey: "person_name",
      id: "person_name",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.jawatan"),
      accessorKey: "person_position",
      id: "person_position",
      meta: {
        enableReadMore: true,
        maxChar: 60,
      },
    },
    {
      header: t("directory.table_header.kementerian"),
      accessorKey: "org_id",
      id: "org_id",
      meta: {
        enableReadMore: true,
        maxChar: 60,
      },
    },
    {
      header: t("directory.table_header.bhg"),
      accessorKey: "division_name",
      id: "division_name",
      meta: {
        cellClass: "whitespace-nowrap",
        enableReadMore: true,
        maxChar: 18,
      },
    },
    {
      header: t("directory.table_header.seksyen"),
      accessorKey: "person_phone",
      id: "person_phone",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.gred"),
      accessorKey: "person_phone",
      id: "person_phone",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.telefon"),
      accessorKey: "person_phone",
      id: "person_phone",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.fax"),
      accessorKey: "person_phone",
      id: "person_phone",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.emel"),
      accessorKey: "person_email",
      id: "person_email",
      meta: {
        headerClass: "whitespace-nowrap",
      },
    },
  ];

  const mobileColumn: ColumnDef<Directory>[] = [
    {
      header: "",
      accessorKey: "division_name",
      id: "division_name",
      cell: ({ row }) => {
        const {
          division_name,
          unit_name,
          person_name,
          person_position,
          person_phone,
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
                  {person_name}
                </span>
              </div>
              <p className="text-black-700">{person_position}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <Phone className="text-outline-400" />
              <span>{person_phone}</span>|
              <div className="flex items-center gap-x-1.5">
                <Envelope className="text-outline-400" />
                <span>{person_email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const data = useMemo(() => {
    const query = searchQuery ? searchQuery.toLowerCase() : "";
    return list.filter((item: Directory) => {
      const matchesQuery =
        (item.person_name?.toLowerCase().includes(query) ?? false) ||
        (item.person_email?.toLowerCase().includes(query) ?? false) ||
        (item.person_position?.toLowerCase().includes(query) ?? false) ||
        (item.division_name?.toLowerCase().includes(query) ?? false);
      return matchesQuery;
    });
  }, [list, searchQuery]);

  const searchArray = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery.toLowerCase());
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

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
          <DataTable
            lng={lng}
            columns={isMobile ? mobileColumn : column}
            data={data}
            resizable={false}
            paginate={{
              pageIndex: 0,
              pageSize: 15,
            }}
            filter={(table, headers) => (
              <DirektoriFilter
                lng={lng}
                table={table}
                headers={headers}
                column="division_name"
                subtitle={t("directory.table_header.bhg")}
              />
            )}
          />
        </div>
      </Section>
    </main>
  );
}
