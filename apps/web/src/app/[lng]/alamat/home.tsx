"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColumnDef } from "@tanstack/react-table";
import Hero from "@/components/layout/hero";
import Section from "@/components/layout/section";
import DataTable from "@/components/ui/data-table";
import Search from "@/components/ui/search";
import { DirektoriFilter } from "../filter";
import Paginate from "@/components/ui/pagination";
import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MobileCard from "@/components/home/mobile-card";
import Profile from "@/components/home/profile";
import { Kakitangan, OfficeDirectory } from "@/lib/types/kakitangan";
import CrossX from "@/icons/cross-x";
import { Link } from "@/components/ui/link";
import OfficeCard from "@/components/home/office-card";
import { concatenateAddress } from "@/lib/utils";

export default function Home({
  lng,
  officeDirectory,
  totalPages,
  ministry,
  state,
}: {
  lng: string;
  officeDirectory: OfficeDirectory[];
  totalPages: number;
  ministry: string[];
  state: string[];
}) {
  const { t } = useTranslation(lng, ["common", "org"]);
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q");
  const currentPage = Number(searchParams.get("page") || "1");
  const ministrySelected = searchParams.get("ministry");
  const stateSelected = searchParams.get("state");

  // TODO: Redo the ColumnDef
  const column: ColumnDef<OfficeDirectory>[] = [
    {
      header: t("alamat.table_header.nama"),
      accessorKey: "name",
      id: "name",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
      meta: {
        headerClass: "border-r sticky bg-background left-0 z-10",
        cellClass:
          "border-r sticky bg-background left-0 z-10 sm:py-1.5 uppercase",
      },
    },
    {
      header: t("alamat.table_header.alamat"),
      accessorKey: "address",
      id: "address",
      cell: ({ row }) => {
        const address = row.original.address;

        return (
          <div className="w-[400px]">
            <span className="whitespace-pre-line">
              {concatenateAddress(address)}
            </span>
          </div>
        );
      },
    },
    {
      header: t("alamat.table_header.negeri"),
      accessorKey: "address.state",
      id: "state_name",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        expandable: true,
      },
    },
    {
      header: t("alamat.table_header.telefon"),
      accessorKey: "contact.phone",
      id: "phone",
      cell: (row) => row.getValue() ?? "—",
    },
    {
      header: t("alamat.table_header.fax"),
      accessorKey: "contact.fax",
      id: "fax",
      cell: (row) => row.getValue() ?? "—",
    },
    {
      header: t("alamat.table_header.emel"),
      accessorKey: "contact.email",
      id: "email",
      cell: (row) => row.getValue() ?? "—",
    },
    {
      header: t("alamat.table_header.website"),
      accessorKey: "contact.website",
      id: "website",
      cell: (row) => {
        const website = row.getValue() as string;

        if (!website || website === "-") {
          return "—";
        }

        // Remove http(s):// and trailing slash for display
        const displayUrl = website
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .replace(/\/$/, "");

        return (
          <Link
            primary
            underline={"none"}
            href={website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayUrl}
          </Link>
        );
      },
    },
  ];

  const mobileColumn: ColumnDef<OfficeDirectory>[] = [
    {
      header: "",
      accessorKey: "person_name",
      id: "person_name",
      cell: ({ row }) => <OfficeCard lng={lng} {...row.original}></OfficeCard>,
    },
  ];

  // TODO: Redo the logic
  const setSearchParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);

      if (key === "ministry") {
        params.delete("state");
      }

      if (key !== "page") params.delete("page");
      return push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams],
  );

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <main>
      <Hero
        title={t("alamat.header")}
        search={
          <Search
            onChange={(query) => setSearchParams("q", query || null)}
            placeholder={t("alamat.search_placeholder")}
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
              subtitle={t("alamat.dropdown_title.kementerian")}
              disabled={ministry?.length == 0}
              items={ministry}
              selectedItem={ministrySelected}
              onChange={(currentValue) =>
                setSearchParams("ministry", currentValue)
              }
            />
            <DirektoriFilter
              lng={lng}
              subtitle={t("alamat.dropdown_title.negeri")}
              disabled={state?.length == 0 || !ministrySelected}
              items={state}
              selectedItem={stateSelected}
              onChange={(currentValue) =>
                setSearchParams("state", currentValue)
              }
            />
          </div>
          <DataTable
            lng={lng}
            columns={isMobile ? mobileColumn : column}
            data={officeDirectory}
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
              setPage={(page) => setSearchParams("page", page.toString())}
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
