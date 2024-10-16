"use client";

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import ChevronLeft from "@/icons/chevron-left";
import ChevronRight from "@/icons/chevron-right";
import Ellipsis from "@/icons/ellipsis";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps, forwardRef, useMemo } from "react";
import { useTranslation } from "@/i18n/client";

const Pagination = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center", className)}
      {...props}
    />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("rounded-md", className)} {...props} />
  ),
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size" | "variant" | "disabled"> &
  ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  disabled,
  isActive,
  size,
  variant,
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant,
        size,
      }),
      isActive ? "bg-brand-50" : "",
      "lg:size-10",
      className,
    )}
    aria-disabled={disabled}
    scroll={false}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-8 items-center justify-center", className)}
    {...props}
  >
    <Ellipsis className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export default function Paginate({
  currentPage,
  totalPages,
  lng,
  disableNext,
  disablePrev,
  setPage,
}: {
  currentPage: number;
  totalPages: number;
  lng: string;
  disableNext: boolean;
  disablePrev: boolean;
  setPage: (page: number) => void;
}) {
  const { t } = useTranslation(lng);
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const DOTS = "...";
  const siblings = 1;

  const pageRange = useMemo(() => {
    if (totalPages <= 5 + siblings) {
      return range(1, totalPages);
    }

    const leftSibIdx = Math.max(currentPage - siblings, 1);
    const rightSibIdx = Math.min(currentPage + siblings, totalPages);

    const showLeftDots = leftSibIdx > 2;
    const showRightDots = rightSibIdx < totalPages - 2;

    const firstPageIdx = 1;
    const lastPageIdx = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIdx, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSibIdx, rightSibIdx);
      return [firstPageIdx, DOTS, ...middleRange, DOTS, lastPageIdx];
    }
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="secondary"
            size="default"
            className="p-2 lg:p-2.5 mr-3"
            disabled={disablePrev}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">{t("pagination.previous")}</span>
          </Button>
        </PaginationItem>

        {pageRange?.map((page, i) => {
          return typeof page === "number" ? (
            <PaginationItem className="hidden min-[360px]:flex" key={i}>
              <Button
                onClick={() => setPage(page)}
                variant={currentPage === page ? "tertiary-colour" : "tertiary"}
                className={cn(
                  "sm:size-[40px]",
                  currentPage === page ? "bg-brand-50" : "",
                )}
              >
                {page}
              </Button>
            </PaginationItem>
          ) : (
            <PaginationItem className="hidden min-[360px]:flex" key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        })}
        <span className="flex items-center gap-1 text-center min-[360px]:hidden">
          {t("pagination.page_of", {
            current: currentPage,
            total: totalPages,
          })}
        </span>
        <PaginationItem>
          <Button
            aria-label={t("pagination.next")}
            variant="secondary"
            size="default"
            className="p-2 lg:p-2.5 ml-3"
            disabled={disableNext}
            onClick={() => setPage(currentPage + 1)}
          >
            <span className="sr-only">{t("pagination.next")}</span>
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
