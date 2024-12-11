"use client";

import { useTranslation } from "@/i18n/client";
import Phone from "@/icons/phone";
import Envelope from "@/icons/envelope";
import Printer from "@/icons/printer";
import { Kakitangan } from "@/lib/types/kakitangan";
import { ReactNode } from "react";
import useToast from "@/hooks/use-toast";

export default function MobileCard({
  lng,
  children,
  ...kakitangan
}: Kakitangan & { children?: ReactNode; lng: string }) {
  const { t } = useTranslation(lng, "org");

  const {
    division_name,
    subdivision_name,
    person_name,
    position_name,
    person_phone,
    person_fax,
    person_email,
    org_type,
    org_id,
    org_name,
  } = kakitangan;

  const { toast } = useToast();

  const copySelectedEmails = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({
        variant: "success",
        title: "Emails copied!",
      });
      // Show success message
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="space-y-2 font-medium text-sm text-dim-500">
      <p className="flex flex-wrap text-xs font-semibold">
        {org_type === "ministry" ? t(org_id) : org_name}{" "}
        {division_name && (
          <>
            | {division_name}{" "}
            {subdivision_name ? <>| {subdivision_name}</> : null}
          </>
        )}
      </p>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-x-1.5">
          <span className="text-base font-semibold text-foreground">
            {person_name ?? "—"}
          </span>
        </div>
        <p className="text-black-700">{position_name}</p>
      </div>

      {person_phone || person_email ? (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {person_phone && (
            <>
              <Phone className="text-outline-400" />
              <span>{person_phone}</span>
            </>
          )}
          {person_phone && person_fax ? "|" : ""}
          {person_fax && (
            <div className="flex items-center gap-x-1.5">
              <Printer className="text-outline-400" />
              <span>{person_fax}</span>
            </div>
          )}
        </div>
      ) : null}

      {person_email && (
        <div
          className="flex items-center gap-x-1.5"
          onClick={() => copySelectedEmails(person_email)}
        >
          <Envelope className="text-outline-400" />
          <span>{person_email}</span>
        </div>
      )}
      {children}
    </div>
  );
}
