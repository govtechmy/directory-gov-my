export default function Hero({
  title,
  search,
}: {
  title: string;
  search?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-outline-200">
      <div className="container flex flex-col gap-6 py-16">
        <h1 className="text-center font-poppins text-[2rem]/10 sm:text-hmd font-semibold">
          {title}
        </h1>
        {search}
      </div>
    </section>
  );
}
