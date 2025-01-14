import { Table } from "@tanstack/react-table";
import { Checkbox, checkbox_cva } from "../ui/checkbox";
import type { VariantProps } from "class-variance-authority";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

interface CheckboxHeaderProps<TData>
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "checked" | "onCheckedChange"
    >,
    Pick<VariantProps<typeof checkbox_cva>, "size"> {
  table: Table<TData>;
  description?: string;
  className?: string;
}

export const CheckboxHeader = <TData,>({
  table,
  size,
  description,
  className,
  ...props
}: CheckboxHeaderProps<TData>) => {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    table.toggleAllRowsSelected(!!checked);
  };

  let isChecked: boolean | "indeterminate" = table.getIsAllRowsSelected()
    ? true
    : table.getIsSomeRowsSelected()
      ? "indeterminate"
      : false;

  return (
    <Checkbox
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      size={size}
      className={className}
      description={description}
      {...props}
    />
  );
};
