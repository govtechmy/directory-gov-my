"use client";

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import SearchIcon from "@/icons/search";
import CrossX from "@/icons/cross-x";
import { Button } from "./button";
import { useTranslation } from "@/i18n/client";

interface SearchProps {
  className?: string;
  placeholder?: string;
  onChange: (query: string) => void;
  disabled?: boolean;
  defaultValue?: string;
  lng: string;
}

const Search: FunctionComponent<SearchProps> = ({
  placeholder,
  className,
  onChange,
  disabled,
  defaultValue,
  lng,
}) => {
  const { t } = useTranslation(lng);
  const [value, setValue] = useState(defaultValue ?? "");
  const [focused, setFocus] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) {
        if (e.key === "/") {
          e.preventDefault();
          searchRef.current?.focus();
        }
        // Check if 'CMD + K' or 'Ctrl + K' key combination is pressed
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          searchRef.current?.focus();
        }
      } else {
        if (e.key === "Escape") {
          e.preventDefault();
          searchRef.current?.blur();
        }
        if (e.key === "Enter") {
          onChange(value);
          searchRef.current?.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focused, value]);

  return (
    <div
      className={cn(
        "mx-auto flex h-[44px] w-full items-center gap-2.5 rounded-full border border-outline-200 bg-background pl-4.5 pr-1.5 shadow-button hover:border-outline-300",
        "has-[:focus]:border-brand-300 has-[:focus]:ring has-[:focus]:ring-brand-600/20 has-[:focus]:ring-offset-0 sm:w-[600px]",
        disabled ? "cursor-not-allowed border-outline-300 bg-washed-100" : "",
        className,
      )}
    >
      <input
        ref={searchRef}
        spellCheck={false}
        disabled={disabled}
        placeholder={placeholder || t("search.default_placeholder")}
        className="flex h-[42px] w-full rounded-md bg-background py-2.5 text-sm outline-none placeholder:text-dim-500 disabled:cursor-not-allowed disabled:opacity-20"
        onChange={(e) => {
          const query = e.target.value;
          setValue(query);
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={value}
      />
      {disabled ? (
        <></>
      ) : value ? (
        <Button
          variant="default"
          size="default"
          className="group rounded-full"
          onClick={() => setValue("")}
        >
          <CrossX className="size-4.5 text-dim-500 group-hover:text-foreground" />
        </Button>
      ) : (
        <span
          className="hidden shrink-0 select-none items-center gap-x-1 text-sm text-dim-500 hover:cursor-text lg:flex"
          onClick={() => searchRef.current?.focus()}
        >
          {t("search.type")}
          <span className="rounded-md border border-outline-300 px-1.5 py-0.5">
            /
          </span>
          {t("search.search")}
        </span>
      )}
      <Button
        variant="default"
        size="default"
        className={cn(
          "size-8 rounded-full bg-gradient-to-b from-[#5288FF] to-brand-600 to-100% p-1.5",
          disabled ? "cursor-not-allowed opacity-20" : "",
        )}
        onClick={() => onChange(value)}
      >
        <SearchIcon className="size-5 text-white" />
      </Button>
    </div>
  );
};

export default Search;
