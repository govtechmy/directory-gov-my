"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Header,
  getSortedRowModel,
  Table as TTable,
  getPaginationRowModel,
  getFacetedUniqueValues,
  Row,
  Cell,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Paginate from "@/components/ui/pagination";
import { useTranslation } from "@/i18n/client";
import { ReactNode, useEffect, useState } from "react";
import ArrowDown from "@/icons/arrow-down";
import ArrowUp from "@/icons/arrow-up";
import ColumnCollapse from "@/icons/column-collapse";
import ColumnExpand from "@/icons/column-expand";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  lng: string;
  resizable?: boolean;
  filterable?: boolean;
  paginate?: {
    pageIndex: number;
    pageSize: number;
  };
  filter?: (
    table: TTable<TData>,
    headers: Header<TData, unknown>[],
  ) => ReactNode;
  onRowSelection?: (value: string[]) => void;
  isMerged?: (row: Row<TData>) => Cell<TData, unknown> | false | undefined;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  lng,
  resizable = false,
  filterable = false,
  filter,
  paginate,
  isMerged,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation(lng);
  const [pagination, setPagination] = useState({
    pageIndex: paginate ? paginate.pageIndex : 0,
    pageSize: paginate ? paginate.pageSize : 10,
  });

  const [expandableColumns, setExpandableColumns] = useState<
    Record<string, boolean | null>
  >(() => {
    const initialState: Record<string, boolean> = {};
    columns.forEach((column) => {
      if (column.id && column.meta && column.meta.expandable) {
        initialState[column.id as string] = false;
        // in the expandedColumn state, only columns that can be expanded will have its headerId in it which depends on enabledReadMore property
      }
    });
    return initialState;
  });

  const toggleColumnWidth = (columnId: string) => {
    setExpandableColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination },

    columnResizeMode: "onChange",
    enableColumnResizing: resizable,
    enableColumnFilters: filterable,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (value) => {
      if (!paginate) return;
      setPagination(value);
    },
    getFacetedUniqueValues: getFacetedUniqueValues(),

    debugTable: false,
    debugHeaders: false,
  });

  const headerGroups = table.getHeaderGroups();
  const tableRow = table.getRowModel().rows;

  useEffect(() => {
    const mergedObj = { ...expandableColumns };
    Object.keys(expandableColumns).forEach((columnId) => {
      const longVisibleRows = table.getRowModel().rows.filter((row) => {
        const value = row.getValue(columnId) as string | null;
        return value !== null && value?.length >= 30;
      });

      // if all the rows has length less than 30, then the state with the columnId will be null. It will not has the expandable column capability
      if (longVisibleRows.length == 0) {
        mergedObj[columnId] = null;
      } else {
        // we set the state back to false such that it will always stay close when we navigate to different page
        mergedObj[columnId] = false;
      }
    });
    setExpandableColumns(mergedObj);
  }, [tableRow]);

  return (
    <>
      {filter ? filter(table, headerGroups[0]!.headers) : <></>}

      <Table
        style={{
          width:
            resizable && data.length > 0
              ? table.getCenterTotalSize()
              : "inherit",
        }}
      >
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    id={header.id}
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      typeof expandableColumns[header.id] === "boolean"
                        ? "group hover:border-brand-300 pb-1"
                        : "",
                      header.column.columnDef.meta?.headerClass,
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2 justify-between whitespace-nowrap">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          desc: <ArrowDown className="h-3 w-3" />,
                          asc: <ArrowUp className="h-3 w-3" />,
                        }[header.column.getIsSorted() as string] ?? null}
                        {typeof expandableColumns[header.id] === "boolean" && (
                          <Button
                            size="default"
                            variant={"secondary-colour"}
                            onClick={() => {
                              toggleColumnWidth(header.id);
                            }}
                            className="px-1 rounded-lg"
                          >
                            {expandableColumns[header.id] ? (
                              <ColumnCollapse className="size-4 text-brand-600" />
                            ) : (
                              <ColumnExpand className="size-4 text-brand-600" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel()?.rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const mergedRow = isMerged ? isMerged(row) : undefined;

              return (
                <TableRow key={row.id}>
                  {mergedRow ? (
                    <TableCell
                      id={mergedRow.id}
                      key={mergedRow.id}
                      colSpan={6}
                      className="font-bold text-center"
                    >
                      {flexRender(
                        mergedRow.column.columnDef.cell,
                        mergedRow.getContext(),
                      )}
                    </TableCell>
                  ) : (
                    row.getVisibleCells().map((cell) => {
                      const columnDef = cell.column.columnDef;
                      const headerId = columnDef.id as string;
                      const canExpand = expandableColumns[headerId];
                      return (
                        <TableCell
                          id={cell.id}
                          key={cell.id}
                          className={cn(
                            "whitespace-nowrap",
                            typeof expandableColumns[headerId] === "boolean" &&
                              `truncate ${!canExpand && "max-w-[230px]"}`,
                            cell.column.columnDef.meta?.cellClass,
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllLeafColumns().length}
                className="text-dim-500 h-24 text-center"
              >
                {t("table.no_data")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {data.length > 0 && paginate && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Paginate
            curr={table.getState().pagination.pageIndex}
            disable_next={!table.getCanNextPage()}
            disable_prev={!table.getCanPreviousPage()}
            setPage={(page) => table.setPageIndex(page)}
            totalPages={table.getPageCount()}
            lng={lng}
          />
        </div>
      )}
    </>
  );
}
