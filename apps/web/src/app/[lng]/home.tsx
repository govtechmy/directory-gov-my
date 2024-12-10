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
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Kakitangan } from "@/lib/types/kakitangan";
import CrossX from "@/icons/cross-x";
import CopyIcon from "@/icons/copy";
import useToast from "@/hooks/use-toast";
import { AutoToast } from "@/components/ui/toast";
import ArrowOutgoing from "@/icons/arrow-outgoing";

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
  const { t } = useTranslation(lng, ["common", "org"]);
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q");
  const currentPage = Number(searchParams.get("page") || "1");
  const orgSelected = searchParams.get("org");
  const divisionSelected = searchParams.get("division");
  const subdivisionSelected = searchParams.get("subdivision");

  type GetSelectedRowsType = (() => any) | null;
  const [rowCopied, setRowCopied] = useState<GetSelectedRowsType>(null);
  const [rowSelection, setRowSelection] = useState({});

  const handleCopyRows = useCallback((getSelectedRowModel: () => any) => {
    setRowCopied(() => getSelectedRowModel);
  }, []);

  const { toast } = useToast();

  const copySelectedEmails = async () => {
    if (!rowCopied) return;

    const selectedRows = rowCopied().rows;
    const emailsToCopy = selectedRows
      .map((row: any) => row.original.person_email)
      .join(",");

    try {
      await navigator.clipboard.writeText(emailsToCopy);
      toast({
        variant: "success",
        title: "Emails copied!",
      });
      // Show success message
    } catch (err) {
      // Handle error
    }
  };

  const column: ColumnDef<Kakitangan>[] = [
    {
      header: t("directory.table_header.nama"),
      accessorKey: "person_name",
      id: "person_name",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
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
      header: ({ table }) => {
        // TODO: check if I can do hooks somewhere
        const checkboxRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate =
              table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
          }
        }, [table]);
        return (
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <input
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              ref={checkboxRef}
              onChange={table.getToggleAllRowsSelectedHandler()}
              className="w-4 h-4"
            />
            {t("directory.table_header.emel")}
          </div>
        );
      },
      accessorKey: "person_email",
      id: "person_email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          {
            // falsy email value cannot be selected to be copied
            row.getValue("person_email") ? (
              <input
                id={row.id}
                type="checkbox"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                className="w-4 h-4"
              />
            ) : (
              <input
                type="checkbox"
                checked={false}
                disabled={true}
                className="w-4 h-4"
              />
            )
          }
          <label htmlFor={row.id} className="cursor-pointer select-none">
            {row.getValue("person_email") ?? "—"}
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
          <Sheet>
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
          </Sheet>
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
            <div className="flex-grow flex justify-end">
              {Object.keys(rowSelection).length > 0 && (
                <Button
                  onClick={copySelectedEmails}
                  variant={"primary"}
                  size={"sm"}
                >
                  <CopyIcon />
                  Copy selected email
                </Button>
              )}
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
            copyEmail={handleCopyRows}
          />
          <AutoToast duration={2000} />
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
