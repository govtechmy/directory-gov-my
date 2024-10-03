import { fetchAllData } from "./actions/elasticsearchActions";
import Homepage from "./home";

export default async function Page({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const dataES = await fetchAllData();
  return (
    <div>
      <pre>{JSON.stringify(dataES, null, 2)}</pre>
      <Homepage lng={lng} dataES={dataES} />;
    </div>
  );
}
