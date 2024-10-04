import "@tanstack/react-table";
import type { HTMLInputTypeAttribute } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    expandable?: boolean;
    headerClass?: string;
    cellClass?: string;
  }
}
