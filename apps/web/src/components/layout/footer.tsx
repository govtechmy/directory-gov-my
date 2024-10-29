import { useTranslation } from "@/i18n";
import Image from "next/image";
import Link from "next/link";

export default async function Footer({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng);

  const className = {
    link: "text-sm text-black-700 underline-font hover:text-foreground hover:underline",
  };

  return (
    <footer className="border-t border-outline-200 bg-background-50 py-8 lg:py-16 print:hidden">
      <div className="container divide-y divide-outline-200 max-sm:px-0">
        <div className="flex flex-col gap-6 pb-8 max-sm:px-4.5 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-4 lg:gap-4.5">
            <div className="flex items-center gap-x-2.5">
              <Image
                src="/assets/jata-negara.png"
                width={28}
                height={28}
                alt="Jata Negara"
                className="select-none"
              />
              <div>
                <p className="whitespace-nowrap font-poppins font-semibold">
                  {}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-sm lg:flex-row">
            {/* {(Object.keys(links)).map((category) => (
              <div className="space-y-2" key={category}>
                <p className="font-semibold">{t(`Footer.${category}`)}</p>
                <div className="grid grid-cols-2 flex-col gap-y-2 sm:grid-cols-4 sm:gap-x-6 lg:flex lg:w-[200px] lg:gap-2">
                  {links[category].map(({ name, href }) =>
                    category === "about_us" ? (
                      <Link
                        key={name}
                        className={className.link}
                        href={href}
                        scroll={true}
                      >
                        {name}
                      </Link>
                    ) : (
                      <a
                        key={name}
                        className={className.link}
                        target="_blank"
                        rel="noopenner noreferrer"
                        href={href}
                      >
                        {name}
                      </a>
                    ),
                  )}
                </div>
              </div>
            ))} */}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 max-sm:px-4.5 pt-8 text-sm text-dim-500 lg:flex-row">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <p>
              {t("footer.all_rights_reserved")} © {new Date().getFullYear()}
            </p>
            {/* <span className="hidden h-3 w-px bg-outline-300 lg:block"></span>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-black-700">
              {["penafian", "dasar-privasi"].map((link) => (
                <Link
                  key={link}
                  className="underline-font text-sm text-black-700 hover:text-foreground hover:underline"
                  href={`/${lng}/${link}`}
                >
                  {t(`footer.${link}`)}
                </Link>
              ))}
            </div> */}
          </div>

          <time dateTime={process.env.LAST_UPDATED}>
            {t("footer.last_update") +
              ": " +
              new Intl.DateTimeFormat(lng, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kuala_Lumpur",
              }).format(new Date(process.env.LAST_UPDATED))}
          </time>
        </div>
      </div>
    </footer>
  );
}
