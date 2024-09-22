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
import ReadMore from "@/components/ui/read-more";
import { useTranslation } from "@/i18n/client";
import { ReactNode, useState } from "react";
import ArrowDown from "@/icons/arrow-down";
import ArrowUp from "@/icons/arrow-up";
import exp from "constants";
import { cn } from "@/lib/utils";

type CustomColumnDef<TData> = ColumnDef<TData, any> & {
  accessorKey: string;
  meta?: {
    enableReadMore?: boolean;
  };
};

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: CustomColumnDef<TData>[];
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

  const [expandedColumns, setExpandedColumns] = useState<
    Record<string, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};
    columns.forEach((column) => {
      if (column.meta && column.meta.enableReadMore) {
        initialState[column.accessorKey] = false;
      }
    });
    return initialState;
  });

  const toggleColumnWidth = (columnId: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  console.log(expandedColumns);
  console.log(data);

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
  console.log(columns);

  return (
    <>
      {/* Action */}
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
                      header.column.columnDef.meta?.headerClass,
                      header.column.columnDef.meta?.enableReadMore
                        ? "group"
                        : "",
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          desc: <ArrowDown className="h-3 w-3" />,
                          asc: <ArrowUp className="h-3 w-3" />,
                        }[header.column.getIsSorted() as string] ?? null}
                        {header.column.columnDef.meta?.enableReadMore &&
                          ((expandedColumns[header.id] as
                            | boolean
                            | undefined) ? (
                            <div className="w-6 h-[18px] border border-blue-200 rounded-lg flex justify-center items-center  opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowUp
                                className="h-4 w-4 text-blue-600 "
                                onClick={() => {
                                  toggleColumnWidth(header.id);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-[18px] border border-blue-200 rounded-lg flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowDown
                                className="h-4 w-4 text-blue-600"
                                onClick={() => {
                                  toggleColumnWidth(header.id);
                                }}
                              />
                            </div>
                          ))}
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
                      const columnDef = cell.column
                        .columnDef as CustomColumnDef<TData>;
                      const headerId = columnDef.accessorKey;
                      const canExpand = expandedColumns[headerId] || false;
                      return (
                        <TableCell
                          id={cell.id}
                          key={cell.id}
                          className={`whitespace-nowrap truncate ${
                            canExpand ? "max-w-[489px]" : "max-w-[230px]"
                          }`}
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
