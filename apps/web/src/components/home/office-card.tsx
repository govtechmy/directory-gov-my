"use client";

import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import { ReactNode } from "react";
import { OfficeDirectory } from "@/lib/types/kakitangan";

export default function OfficeCard({
  children,
  ...officeInfo
}: OfficeDirectory & { children?: ReactNode; lng: string }) {
  const { id, name, address, contact, social_media } = officeInfo;

  //   TODO: social media, function

  // Filter out falsy values from address lines and join with line breaks
  const addressLines = [address.line1, address.line2, address.line3]
    .filter(Boolean)
    .join("\n");

  // Combine postcode and state if they exist
  const locationLine = [address.postcode, address.state]
    .filter(Boolean)
    .join(", ");

  // Combine all parts, filtering out empty strings
  const fullAddress = [addressLines, locationLine].filter(Boolean).join("\n");

  return (
    <div className="space-y-2 font-medium text-sm text-dim-500 flex-flex-col gap-2">
      <p className="flex flex-wrap text-xs font-semibold">{id}</p>
      <div>
        <div className="flex flex-wrap items-center gap-x-1.5">
          <span className="text-base font-semibold text-foreground">
            {name ?? "—"}
          </span>
        </div>
      </div>
      <div>
        <span className="whitespace-pre-line">{fullAddress}</span>
      </div>

      {contact.phone || contact.email ? (
        <div className="flex flex-wrap items-center gap-x-1.5">
          {contact.phone && (
            <>
              <Phone className="text-outline-400" />
              <span>{contact.phone}</span>
            </>
          )}
          {contact.phone && contact.email ? "|" : ""}
          {contact.email && (
            <div className="flex items-center gap-x-1.5">
              <Envelope className="text-outline-400" />
              <span>{contact.email}</span>
            </div>
          )}
        </div>
      ) : null}

      {children}
    </div>
  );
}
