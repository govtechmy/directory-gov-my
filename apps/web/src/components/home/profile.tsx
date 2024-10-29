"use client";

import { Kakitangan } from "@/lib/types/kakitangan";
import Image from "next/image";
import MobileCard from "./mobile-card";

export default function Profile({
  lng,
  ...kakitangan
}: Kakitangan & { lng: string }) {
  const experience = [
    {
      year: 2024,
      role: "Menteri Digital",
      desc: "Kementerian Digital",
    },
    {
      year: 2016,
      role: "Menteri Komunikasi dan Multimedia",
      desc: "Kementerian Digital",
    },
    {
      year: 2008,
      role: "Ahli Parlimen (MP)",
      desc: "Puchong",
    },
  ];

  return (
    <div className="flex flex-col p-6 divide-y divide-outline-200 max-h-full overflow-auto">
      <div className="flex gap-6 pb-4">
        <Image
          src="/assets/profile.png"
          width={96}
          height={96}
          className="size-[72px] sm:size-24 rounded-full"
          alt="Profile picture"
        />
        <MobileCard lng={lng} {...kakitangan} />
      </div>
      <div className="flex flex-col gap-2 pt-6 pb-4">
        <p className="text-dim-500 text-xs font-semibold">Pengalaman</p>

        <div className="flex flex-col gap-y-2">
          {experience.map(({ desc, role, year }, i) => (
            <>
              <div className="flex min-h-0 h-full gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-brand-50 border border-brand-200 text-sm text-foreground-primary px-2 py-0.5">
                    {year}
                  </div>
                  {i < experience.length - 1 && (
                    <div className="grow rounded w-0.5 bg-outline-300 max-h-full" />
                  )}
                </div>
                <div className="flex flex-col gap-1 pb-4">
                  <p className="text-base font-semibold text-foreground">
                    {role}
                  </p>
                  <p className="text-sm text-black-700">{desc}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-6">
        <p className="text-dim-500 text-xs font-semibold">
          Pendidikan Tertinggi
        </p>
        <div>
          <p className="text-base font-semibold text-foreground">
            Ijazah Sarjana Muda Undang-Undang (LLB)
          </p>
          <p className="text-black-700 text-sm">University of Warwick, UK</p>
        </div>
      </div>
    </div>
  );
}
