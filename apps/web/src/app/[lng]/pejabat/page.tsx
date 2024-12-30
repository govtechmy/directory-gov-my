import { Suspense } from "react";
import { getOfficeFilterOptions } from "@/actions/filter-dropdown";
import { searchOffice } from "@/actions/kakitangan";
import Homepage from "./home";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: {
    page: string;
    q: string;
    office: string;
    state: string;
  };
  // TODO: change ministry to office
}) {
  const { q, page, office: name, state } = searchParams;

  const { office: officeDirectory, totalPages } = await searchOffice(
    page ? Number(page) : 1,
    q,
    name,
    state,
  );
  const { name_agg, state_agg } = await getOfficeFilterOptions(name);

  return (
    // useSearchParams require Suspense boundary, separate boundary for fallback customisability
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense>
      <Homepage
        lng={lng}
        officeDirectory={officeDirectory}
        totalPages={totalPages}
        office={name_agg}
        state={state_agg}
      />
    </Suspense>
  );
}
