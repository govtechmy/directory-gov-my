import Homepage from "./home";

export default function Page({ params: { lng } }: { params: { lng: string } }) {
  return <Homepage lng={lng} />;
}
