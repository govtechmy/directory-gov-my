import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OfficeDirectory } from "./types/kakitangan";

interface GenerateMapUrlI {
  (latitude: number, longitude: number, type: "Waze" | "Google"): string;
}

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

export const generateMapUrl: GenerateMapUrlI = (latitude, longitude, type) => {
  switch (type) {
    case "Waze": {
      // refer https://developers.google.com/waze/deeplinks
      let params = new URLSearchParams({
        ll: `${latitude},${longitude}`,
      });
      return `https://waze.com/ul?${params.toString()}`;
    }
    case "Google": {
      // refer https://stackoverflow.com/questions/32806084/google-map-zoom-parameter-in-url-not-working
      return `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=17`;
    }
  }
};
