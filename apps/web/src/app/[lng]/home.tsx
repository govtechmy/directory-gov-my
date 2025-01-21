"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColumnDef } from "@tanstack/react-table";
import Hero from "@/components/layout/hero";
import Section from "@/components/layout/section";
import DataTable from "@/components/ui/data-table";
import Search from "@/components/ui/search";
import { DirektoriFilter } from "./filter";
import Paginate from "@/components/ui/pagination";
import { useCallback, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import MobileCard from "@/components/home/mobile-card";
import { Kakitangan } from "@/lib/types/kakitangan";
import CopyIcon from "@/icons/copy";
import useToast from "@/hooks/use-toast";
import { AutoToast } from "@/components/ui/toast";
import { CheckboxHeader } from "@/components/home/checkbox-header";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home({
  lng,
  kakitangan,
  totalPages,
  size,
  orgs,
  divisions,
  subdivisions,
}: {
  lng: string;
  kakitangan: Kakitangan[];
  totalPages: number;
  size: number;
  orgs: string[];
  divisions: string[];
  subdivisions: string[];
}) {
  const { t } = useTranslation(lng, ["common", "org"]);
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ROWS_PER_PAGE = [10, 25, 50].map((row) => row.toString());

  const searchQuery = searchParams.get("q");
  const currentPage = Number(searchParams.get("page") || "1");
  const orgSelected = searchParams.get("org");
  const divisionSelected = searchParams.get("division");
  const subdivisionSelected = searchParams.get("subdivision");

  const [rowSelection, setRowSelection] = useState({});

  const { toast } = useToast();

  const copySelectedEmails = async () => {
    if (!rowSelection) return;

    const selectedRowIndices = Object.keys(rowSelection);
    const emailsToCopy = selectedRowIndices.map(
      (index) => kakitangan[Number(index)]?.person_email,
    );

    try {
      await navigator.clipboard.writeText(emailsToCopy.join(","));
      toast({
        variant: "success",
        title: t("directory.copyEmail.success"),
        description: t("directory.copyEmail.success_desc", {
          count: emailsToCopy.length,
        }),
      });
    } catch (err) {
      toast({
        variant: "error",
        title: t("directory.copyEmail.error"),
      });
    }
  };

  useEffect(() => {
    // clear row selected when page changed
    setRowSelection({});
  }, [currentPage]);

  const column: ColumnDef<Kakitangan>[] = [
    {
      header: t("directory.table_header.nama"),
      accessorKey: "person_name",
      id: "person_name",
      cell: (row) => row.getValue() ?? "—",
      // cell: ({ getValue, row }) => (
      //   <Dialog>
      //     <DialogTrigger asChild>
      //       <Button variant="tertiary">{(getValue() as string) ?? "—"}</Button>
      //     </DialogTrigger>
      //     <DialogContent className="p-0 gap-0 max-w-[600px]">
      //       <DialogHeader className="p-6 border-b border-outline-200">
      //         <DialogTitle>Profil Penjawat Awam</DialogTitle>
      //       </DialogHeader>
      //       <Profile lng={lng} {...row.original} />
      //     </DialogContent>
      //   </Dialog>
      // ),
      meta: {
        headerClass: "border-r sticky bg-background left-0 z-10",
        cellClass: "border-r sticky bg-background left-0 z-10 sm:py-1.5",
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.jawatan"),
      accessorKey: "position_name",
      id: "position_name",
      cell: (row) => row.getValue(),
      meta: {
        expandable: true,
      },
    },
    {
      header: t("directory.table_header.telefon"),
      accessorKey: "person_phone",
      id: "person_phone",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        cellClass: "select-all",
      },
    },
    {
      header: t("directory.table_header.fax"),
      accessorKey: "person_fax",
      id: "person_fax",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        cellClass: "select-all",
      },
    },
    {
      header: t("directory.table_header.kementerian"),
      accessorKey: "org_name",
      id: "org_name",
      cell: ({ row }) => {
        const { org_type, org_id, org_name } = row.original;
        return org_type === "ministry" ? t(`org:${org_id}`) : org_name;
      },
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
      accessorKey: "subdivision_name",
      id: "subdivision_name",
      cell: (row) => row.getValue() ?? "—",
      meta: {
        expandable: true,
      },
    },
    {
      header: ({ table }) => {
        return (
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <CheckboxHeader
              table={table}
              size="small"
              className="rounded-xs"
              id="checkbox-header"
            />
            {/* Emel */}
            <label
              htmlFor="checkbox-header"
              className="cursor-pointer select-none"
            >
              {t("directory.table_header.emel")}
            </label>
          </div>
        );
      },
      accessorKey: "person_email",
      id: "person_email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          {(() => {
            const email = row.getValue("person_email");
            const isEmailValid = email && email !== "—";

            return (
              <Checkbox
                id={row.id}
                className="rounded-xs"
                checked={isEmailValid ? row.getIsSelected() : false}
                disabled={!isEmailValid || !row.getCanSelect()}
                onCheckedChange={row.getToggleSelectedHandler()}
              />
            );
          })()}
          <label htmlFor={row.id} className="cursor-pointer select-none">
            {row.getValue("person_email")}
          </label>
        </div>
      ),
      meta: {
        headerClass: "sticky bg-background right-0 border-l",
        cellClass: "sticky bg-background right-0 border-l",
      },
    },
    // {
    //   id: "profile_info",
    //   size: 100,
    //   cell: ({ row }) => (
    //     <>
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <Button variant="tertiary">
    //             <ArrowOutgoing className="size-[16px]" />
    //             Profil
    //           </Button>
    //         </DialogTrigger>
    //         <DialogContent className="p-0 gap-0 max-w-[600px]">
    //           <DialogHeader className="p-6 border-b border-outline-200">
    //             <DialogTitle>Profil Penjawat Awam</DialogTitle>
    //           </DialogHeader>
    //           <Profile lng={lng} {...row.original} />
    //         </DialogContent>
    //       </Dialog>
    //     </>
    //   ),
    //   meta: {
    //     headerClass: "sticky bg-background right-0 border-l sm:py-1.5",
    //     cellClass: "sticky bg-background right-0 border-l sm:py-1.5",
    //   },
    // },
  ];

  const mobileColumn: ColumnDef<Kakitangan>[] = [
    {
      header: "",
      accessorKey: "person_name",
      id: "person_name",
      cell: ({ row }) => (
        <MobileCard lng={lng} {...row.original}>
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="tertiary-colour">Profile</Button>
            </SheetTrigger>
            <SheetPortal>
              <SheetOverlay />
              <SheetContent
                side="bottom"
                className="flex flex-col p-0 gap-0 min-h-0 max-h-[85dvh] max-sm:w-full"
              >
                <SheetHeader className="p-4.5 border-b border-outline-200">
                  <SheetTitle>Profil Penjawat Awam</SheetTitle>
                  <SheetClose className="absolute right-4 top-3.5">
                    <CrossX className="size-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </SheetHeader>
                <Profile lng={lng} {...row.original} />
              </SheetContent>
            </SheetPortal>
          </Sheet> */}
        </MobileCard>
      ),
    },
  ];

  const setSearchParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);

      if (key === "org") {
        params.delete("division");
        params.delete("subdivision");
      } else if (key === "division") params.delete("subdivision");

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
        title={t("directory.header")}
        search={
          <Search
            onChange={(query) => setSearchParams("q", query || null)}
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
              onChange={(currentValue) => setSearchParams("org", currentValue)}
            />
            <DirektoriFilter
              lng={lng}
              subtitle={t("directory.table_header.bhg")}
              disabled={divisions?.length == 0 || !orgSelected}
              items={divisions}
              selectedItem={divisionSelected}
              onChange={(currentValue) =>
                setSearchParams("division", currentValue)
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
                setSearchParams("subdivision", currentValue)
              }
            />
            <div className="hidden sm:flex flex-grow justify-end">
              <Button
                onClick={copySelectedEmails}
                variant={"primary"}
                size={"sm"}
                disabled={Object.keys(rowSelection).length === 0}
              >
                <CopyIcon />
                Copy selected email
              </Button>
            </div>
          </div>

          <DataTable
            lng={lng}
            columns={isMobile ? mobileColumn : column}
            data={kakitangan}
            resizable={false}
            isMobile={isMobile}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />

          <div className="flex flex-col items-center justify-between gap-2 pt-8 sm:flex-row">
            <div className="flex gap-3 items-center">
              <span className="text-sm text-dim-500 whitespace-nowrap">
                {t("table.rows_per_page")}
              </span>
              <Select
                value={size.toString()}
                onValueChange={(size) => setSearchParams("size", size)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROWS_PER_PAGE.map((rows) => (
                    <SelectItem key={rows} value={rows}>
                      {rows}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
        <AutoToast />
      </Section>
    </main>
  );
}
