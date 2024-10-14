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
import Paginate from "@/components/ui/pagination";

interface Kakitangan {
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
  const currentPage = Number(searchParams.get("page") || "1");

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
      accessorKey: "person_position",
      id: "person_position",
      cell: (row) => row.getValue(),
      meta: {
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.kementerian"),
      accessorKey: "org_id",
      id: "org_id",
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
          person_position,
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
              <p className="text-black-700">{person_position}</p>
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
            data={kakitangan}
            resizable={false}
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
          <div className="flex items-center justify-center gap-2 pt-8">
            <Paginate
              currentPage={currentPage}
              totalPages={totalPages}
              lng={lng}
              disableNext={currentPage >= totalPages}
              disablePrev={currentPage <= 1}
              setPage={(page) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", page.toString());
                replace(`${pathname}?${params.toString()}`, { scroll: false });
              }}
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
