import { filterDropdown } from "./actions/filter-dropdown";
import { searchKakitangan } from "./actions/kakitangan";
import Homepage from "./home";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: {
    page: string;
    q: string;
    division_name: string;
    unit_name: string;
  };
}) {
  const { q, page, division_name, unit_name } = searchParams;
  const { kakitangan, totalPages } = await searchKakitangan(
    page ? Number(page) : 1,
    q,
    unit_name,
    division_name,
  );
  return <Homepage lng={lng} kakitangan={kakitangan} totalPages={totalPages} />;
}
