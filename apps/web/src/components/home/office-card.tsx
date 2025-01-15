"use client";

import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import { ReactNode } from "react";
import { OfficeDirectory } from "@/lib/types/kakitangan";
import { concatenateAddress } from "@/lib/utils";
import SocialMediaIcon from "./social-media";
import Printer from "@/icons/printer";

export default function OfficeCard({
  children,
  ...officeInfo
}: OfficeDirectory & { children?: ReactNode; lng: string }) {
  const { id, name, address, contact, social_media } = officeInfo;

  console.log(social_media);

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
        <span className="whitespace-pre-line text-txt-black-500">
          {concatenateAddress(address)}
        </span>
      </div>

      <div className="space-y-1">
        {contact.phone && (
          <div className="flex items-center gap-x-1.5">
            <Phone className="text-outline-400" />
            {Array.isArray(contact.phone)
              ? contact.phone.map((num, i) =>
                  i + 1 < contact.phone.length ? num + " / " : num,
                )
              : contact.phone}
          </div>
        )}
        {contact.fax && (
          <div className="flex items-center gap-x-1.5">
            <Printer className="text-outline-400" />
            {Array.isArray(contact.fax)
              ? contact.fax.map((num, i) =>
                  i + 1 < contact.fax.length ? num + " / " : num,
                )
              : contact.fax}
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-x-1.5">
            <Envelope className="text-outline-400" />
            <span>{contact.email}</span>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-2">
        {Object.entries(social_media).map(([platform, url]) => (
          <SocialMediaIcon
            key={platform}
            platform={platform as any}
            url={url}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
