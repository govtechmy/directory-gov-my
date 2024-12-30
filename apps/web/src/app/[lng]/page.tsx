import { Suspense } from "react";
import { getFilterOptions } from "@/actions/filter-dropdown";
import { searchKakitangan } from "@/actions/kakitangan";
import Homepage from "./home";
import * as sampleData from "./sampleData.json";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: {
    page: string;
    q: string;
    size: string;
    org: string;
    division: string;
    subdivision: string;
  };
}) {
  const DEFAULT_SIZE = 25;
  const { q, page, size, division, subdivision, org } = searchParams;
  const _size = size ? Number(size) : DEFAULT_SIZE;
  const { kakitangan, totalPages } = await searchKakitangan(
    page ? Number(page) : 1,
    _size,
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
        size={_size}
        orgs={org_agg}
        divisions={division_agg}
        subdivisions={subdivision_agg}
      />
    </Suspense>
  );
}
