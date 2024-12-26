import { Suspense } from "react";
// import { getFilterOptions } from "@/actions/filter-dropdown";
// import { searchKakitangan } from "@/actions/kakitangan";
import Homepage from "./home";

// TODO: remove when ES is up
import * as sampleData from "../office-sample-data.json";

export default async function Page({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams: {
    page: string;
    q: string;
    ministry: string;
    state: string;
  };
}) {
  const { q, page, ministry, state } = searchParams;

  // TODO: uncomment when ES is up
  // const { kakitangan, totalPages } = await searchKakitangan(
  //   page ? Number(page) : 1,
  //   q,
  //   org,
  //   division,
  //   subdivision
  // );
  // const { org_agg, division_agg, subdivision_agg } = await getFilterOptions(
  //   org,
  //   division
  // );

  // TODO: remove this when ES is back up
  let totalPages = 1;
  let officeDirectory = JSON.parse(JSON.stringify(sampleData));
  let ministry_agg = [
    "JABATAN PERDANA MENTERI",
    "KEMENTERIAN KEWANGAN",
    "KEMENTERIAN KEMAJUAN DESA DAN WILAYAH",
    "KEMENTERIAN PERALIHAN TENAGA DAN TRANSFORMASI AIR",
    "MINISTRY OF TRANSPORT",
    "KEMENTERIAN PERTANIAN DAN KETERJAMINAN MAKANAN",
    "KEMENTERIAN EKONOMI",
    "KEMENTERIAN PERUMAHAN DAN KERAJAAN TEMPATAN",
    "KEMENTERIAN LUAR NEGARA MALAYSIA",
    "KEMENTERIAN KERJA RAYA",
    "KEMENTERIAN DALAM NEGARA",
    "MINISTRY OF INVESTMENT, TRADE AND INDUSTRY (MITI)",
    "KEMENTERIAN PERTAHANAN MALAYSIA",
    "KEMENTERIAN SAINS, TEKNOLOGI DAN INOVASI",
    "KEMENTERIAN PEMBANGUNAN WANITA, KELUARGA DAN MASYARAKAT",
    "KEMENTERIAN SUMBER ASLI DAN KELESTARIAN ALAM",
    "KEMENTERIAN PEMBANGUNAN USAHAWAN DAN KOPERASI",
    "KEMENTERIAN PENDIDIKAN TINGGI",
    "KEMENTERIAN PELANCONGAN, SENI DAN BUDAYA",
    "KEMENTERIAN KOMUNIKASI",
    "KEMENTERIAN PENDIDIKAN MALAYSIA",
    "KEMENTERIAN PERPADUAN NEGARA",
    "Kementerian Belia dan Sukan Malaysia",
    "Kementerian Wilayah Persekutuan",
    "Kementerian Perdagangan Dalam Negeri dan Kos Sara Hidup",
    "KEMENTERIAN PERLADANGAN DAN KOMODITI",
    "Kementerian Digital",
    "Kementerian Kesihatan Malaysia",
    "Kementerian Sumber Manusia",
  ];
  let state_agg = ["W.P. Putrajaya", "W.P. Kuala Lumpur"];

  return (
    // useSearchParams require Suspense boundary, separate boundary for fallback customisability
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense>
      <Homepage
        lng={lng}
        officeDirectory={officeDirectory}
        totalPages={totalPages}
        ministry={ministry_agg}
        state={state_agg}
      />
    </Suspense>
  );
}
