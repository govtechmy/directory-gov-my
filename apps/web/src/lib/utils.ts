import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OfficeDirectory } from "./types/kakitangan";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  callback: F,
  wait: number = 300,
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

export function concatenateAddress(
  address: OfficeDirectory["address"],
  separator = "\n",
) {
  // Filter out falsy values from address lines and join with line breaks
  const addressLines = [address.line1, address.line2, address.line3]
    .filter(Boolean)
    .join(separator);

  // Combine postcode and state if they exist
  const locationLine = [address.postcode, address.state]
    .filter(Boolean)
    .join(", ");

  // Combine all parts, filtering out empty strings
  const fullAddress = [addressLines, locationLine].join(separator);
  return fullAddress;
}

export function encodeAddress(address: string) {
  // refer https://developers.google.com/maps/documentation/urls/get-started#search-action
  const params = new URLSearchParams({
    api: "1",
    query: address,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
