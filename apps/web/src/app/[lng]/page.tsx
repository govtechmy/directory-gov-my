import { fetchAllData } from "./actions/elasticsearchActions";
import Homepage from "./home";

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const dataES = await fetchAllData();
  console.log(dataES);
  return (
    <div>
      <Homepage lng={lng} dataES={dataES} />;
    </div>
  );
}
