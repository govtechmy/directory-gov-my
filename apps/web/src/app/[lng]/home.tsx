"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColumnDef } from "@tanstack/react-table";
import Hero from "@/components/layout/hero";
import Section from "@/components/layout/section";
import DataTable from "@/components/ui/data-table";
import Search from "@/components/ui/search";
import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import Printer from "@/icons/printer";
import { DirektoriFilter } from "./filter";
import Paginate from "@/components/ui/pagination";
import { useCallback } from "react";

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
  orgs,
  divisions,
  subdivisions,
}: {
  lng: string;
  kakitangan: Kakitangan[];
  totalPages: number;
  orgs: string[];
  divisions: string[];
  subdivisions: string[];
}) {
  const { t } = useTranslation(lng);
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q");
  const currentPage = Number(searchParams.get("page") || "1");
  const orgSelected = searchParams.get("org");
  const divisionSelected = searchParams.get("division");
  const subdivisionSelected = searchParams.get("subdivision");

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
      accessorKey: "person_name",
      id: "person_name",
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
            <p className="flex flex-wrap text-xs font-semibold">
              {division_name} {unit_name ? <>| {unit_name}</> : <></>}
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
                {person_phone && person_fax ? "|" : ""}
                {person_fax && (
                  <div className="flex items-center gap-x-1.5">
                    <Printer className="text-outline-400" />
                    <span>{person_fax}</span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {person_email && (
              <div className="flex items-center gap-x-1.5">
                <Envelope className="text-outline-400" />
                <span>{person_email}</span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams],
  );

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <main>
      <Hero
        title={t("directory.header")}
        search={
          <Search
            onChange={(query) =>
              updateParams({
                q: query,
                page: null,
              })
            }
            placeholder={t("directory.search_placeholder")}
            defaultValue={searchQuery || ""}
            lng={lng}
          />
        }
      />

      <Section>
        <div className="w-full border-washed-100 py-12 lg:border-x lg:px-6">
          <div className="flex flex-wrap flex-col gap-3 sm:flex-row sm:gap-x-4 sm:pb-4">
            <DirektoriFilter
              lng={lng}
              subtitle={t("directory.table_header.kementerian")}
              disabled={orgs?.length == 0}
              items={orgs}
              selectedItem={orgSelected}
              onChange={(currentValue) =>
                updateParams({
                  org: currentValue,
                  division: null,
                  subdivision: null,
                  page: null,
                })
              }
            />
            <DirektoriFilter
              lng={lng}
              subtitle={t("directory.table_header.bhg")}
              disabled={divisions?.length == 0 || !orgSelected}
              items={divisions}
              selectedItem={divisionSelected}
              onChange={(currentValue) =>
                updateParams({
                  division: currentValue,
                  subdivision: null,
                  page: null,
                })
              }
            />
            <DirektoriFilter
              lng={lng}
              subtitle={t("directory.table_header.seksyen")}
              disabled={
                subdivisions?.length == 0 || !orgSelected || !divisionSelected
              }
              items={subdivisions}
              selectedItem={subdivisionSelected}
              onChange={(currentValue) =>
                updateParams({
                  subdivision: currentValue,
                  page: null,
                })
              }
            />
          </div>
          <DataTable
            lng={lng}
            columns={isMobile ? mobileColumn : column}
            data={kakitangan}
            resizable={false}
            isMobile={isMobile}
          />
          <div className="flex items-center justify-center gap-2 pt-8">
            <Paginate
              currentPage={currentPage}
              totalPages={totalPages}
              lng={lng}
              disableNext={currentPage >= totalPages}
              disablePrev={currentPage <= 1}
              setPage={(page) =>
                updateParams({
                  page: page.toString(),
                })
              }
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
