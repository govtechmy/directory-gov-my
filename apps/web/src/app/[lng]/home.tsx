"use client";

import Hero from "@/components/layout/hero";
import Section from "@/components/layout/section";
import DataTable from "../../components/ui/data-table";
import Search from "@/components/ui/search";
import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import { Cell } from "@tanstack/react-table";
import { useMemo } from "react";
import { DirektoriFilter } from "./filter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Directory {
  id: number;
  id_bhg: string;
  bhg: string;
  staff_id?: number;
  nama?: string | null;
  gred?: string | null;
  jawatan?: string | null;
  telefon?: string | null;
  emel?: string | null;
}

let list = require("./directory_kd.json");

export default function Home({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);
  const { replace } = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const column = [
    {
      header: t("directory.table_header.nama"),
      accessorKey: "nama",
      id: "nama",
      meta: {
        headerClass: `whitespace-nowrap sticky-column-border`,
        cellClass: `whitespace-nowrap sticky-column-border`,
      },
      cell: (info: any) =>
        info.row.original.id === -1 ? (
          `${info.row.original.bhg} - ${info.getValue()}`
        ) : info.row.original.id === 0 ? (
          <span>—</span>
        ) : (
          info.getValue()
        ),
    },
    {
      header: t("directory.table_header.gred"),
      accessorKey: "gred",
      meta: {
        enableReadMore: true,
        maxChar: 10,
      },
    },
    {
      header: t("directory.table_header.bhg"),
      accessorKey: "bhg",
      id: "bhg",
      meta: {
        cellClass: "whitespace-nowrap",
        enableReadMore: true,
        maxChar: 18,
      },
    },
    {
      header: t("directory.table_header.jawatan"),
      accessorKey: "jawatan",
      id: "jawatan",
      meta: {
        enableReadMore: true,
        maxChar: 60,
      },
    },
    {
      header: t("directory.table_header.telefon"),
      accessorKey: "telefon",
      id: "telefon",
      meta: {
        cellClass: "whitespace-nowrap",
      },
    },
    {
      header: t("directory.table_header.emel"),
      accessorKey: "emel",
      id: "emel",
      size: 100,
      meta: {
        headerClass: "whitespace-nowrap",
      },
    },
  ];

  const mobileColumn = [
    {
      header: "",
      accessorKey: "bhg",
      id: "bhg",
      accessorFn: (item: Directory) =>
        typeof item.id_bhg !== "string" && item.bhg,
      cell: (info: any) => {
        const { id_bhg, bhg, emel, gred, id, jawatan, nama, telefon } = (
          info as Cell<Directory, unknown>
        ).row.original;

        if (id === -1)
          return (
            <p className="text-center font-semibold">
              {typeof id_bhg !== "string" && bhg} - {nama}
            </p>
          );

        return (
          <div className="space-y-2 font-medium text-dim-500">
            <p className="text-balance text-xs font-semibold">
              {typeof id_bhg !== "string" && bhg}
            </p>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-x-1.5">
                <span className="text-base font-semibold text-foreground">
                  {id === 0 ? <span>—</span> : nama}
                </span>
                {/* {gred !== "-" ? (
                  <span className="rounded-md bg-outline-200 px-1 text-black-700">
                    {gred}
                  </span>
                ) : (
                  <></>
                )} */}
              </div>
              <p className="text-black-700">{jawatan}</p>
            </div>

            {telefon !== "-" || emel !== "-" ? (
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {telefon !== "-" ? (
                  <>
                    <Phone className="text-outline-400" />
                    <span>{telefon}</span>
                  </>
                ) : (
                  <></>
                )}
                {telefon !== "-" && emel !== "-" ? "|" : ""}
                {emel !== "-" ? (
                  <div className="flex items-center gap-x-1.5">
                    <Envelope className="text-outline-400" />
                    <span>{`${emel}@${""}.gov.my`}</span>
                  </div>
                ) : (
                  <></>
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

  const data = useMemo(() => {
    const query = searchQuery ? searchQuery.toLowerCase() : "";

    return list.filter((item: Directory) => {
      const matchesQuery =
        (item.nama && item.nama.toLowerCase().includes(query)) ||
        (item.emel && item.emel.toLowerCase().includes(query)) ||
        // (item.gred && item.gred.toLowerCase().includes(query)) ||
        (item.jawatan && item.jawatan.toLowerCase().includes(query));

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
                column="bhg"
                subtitle={t("directory.table_header.bhg")}
              />
            )}
            isMerged={
              !isMobile
                ? (row) => {
                    if (row.original.staff_id === -1)
                      return row.getVisibleCells()[0];
                    return false;
                  }
                : undefined
            }
          />
        </div>
      </Section>
    </main>
  );
}
