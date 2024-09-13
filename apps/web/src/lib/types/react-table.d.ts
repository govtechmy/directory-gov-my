import "@tanstack/react-table";
import type { HTMLInputTypeAttribute } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    enableReadMore?: boolean;
    maxChar?: number;
    headerClass?: string;
    cellClass?: string;
  }
}
