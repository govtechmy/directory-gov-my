import { Suspense } from "react";
import { getFilterOptions } from "@/actions/filter-dropdown";
import { searchKakitangan } from "@/actions/kakitangan";
import Homepage from "./home";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: {
    page: string;
    q: string;
    org: string;
    division: string;
    subdivision: string;
  };
}) {
  const { q, page, division, subdivision, org } = searchParams;

  const { kakitangan, totalPages } = await searchKakitangan(
    page ? Number(page) : 1,
    q,
    org,
    division,
    subdivision,
  );
  const { org_agg, division_agg, subdivision_agg } = await getFilterOptions(
    org,
    division,
  );

  return (
    // useSearchParams require Suspense boundary, separate boundary for fallback customisability
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense>
      <Homepage
        lng={lng}
        kakitangan={kakitangan}
        totalPages={totalPages}
        orgs={org_agg}
        divisions={division_agg}
        subdivisions={subdivision_agg}
      />
    </Suspense>
  );
}
