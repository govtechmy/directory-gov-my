"use client";

import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import { ReactNode } from "react";
import { OfficeDirectory } from "@/lib/types/kakitangan";
import { concatenateAddress } from "@/lib/utils";
import SocialMediaIcon from "./social-media";

export default function OfficeCard({
  children,
  ...officeInfo
}: OfficeDirectory & { children?: ReactNode; lng: string }) {
  const { id, name, address, contact, social_media } = officeInfo;

  //   TODO: social media

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
