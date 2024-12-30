import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 rounded-md whitespace-nowrap text-start font-medium active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-40 focus:ring-fr-primary focus:outline-none",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "from-brand-600 to-[#3E7AFF] bg-gradient-to-t text-white hover:to-[#5B8EFF] shadow-button",
        secondary:
          "border border-outline-200 hover:border-outline-300 bg-background focus:ring shadow-button",
        "secondary-colour":
          "border border-brand-200 hover:border-brand-300 bg-background hover:bg-brand-50 text-foreground-primary focus:border-brand-200 focus:ring focus:ring-fr-primary shadow-button",
        tertiary: "hover:bg-washed-100 focus:ring focus:ring-fr-primary",
        "tertiary-colour":
          "hover:bg-brand-50 text-foreground-primary focus:ring focus:ring-fr-primary",
        "danger-primary":
          "border border-danger-600 bg-danger-600 hover:bg-danger-700 hover:border-danger-700 text-white focus:border-danger-600 focus:ring focus:ring-fr-primary shadow-button disabled:bg-danger-300 disabled:border-danger-300",
      },
      size: {
        default: "",
        sm: "px-2.5 py-1.5 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-3 py-2.5 text-base",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "sm",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
