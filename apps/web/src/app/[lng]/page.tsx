import { filterDropdown } from "./actions/filter-dropdown";
import { searchKakitangan } from "./actions/kakitangan";
import Homepage from "./home";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: { page: string; q: string };
}) {
  const { q, page } = searchParams;
  const { kakitangan, totalPages } = await searchKakitangan(
    page ? Number(page) : 1,
    q,
  );
  return <Homepage lng={lng} kakitangan={kakitangan} totalPages={totalPages} />;
}
