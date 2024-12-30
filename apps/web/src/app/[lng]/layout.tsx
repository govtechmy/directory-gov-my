import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import Masthead from "@/components/layout/masthead";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import ClarityScript from "./clarity";
import { languages } from "@/i18n/settings";
import { useTranslation } from "@/i18n";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-poppins",
});
// const roboto_mono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-roboto-mono",
// });

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = await useTranslation(lng);

  // let ogImages = [];
  // if (locale === "ms-MY") {
  //   ogImages.push({
  //     url: `${process.env.APP_URL}/og/ms-MY.png`,
  //     width: 1200,
  //     height: 600,
  //   });
  // } else {
  //   ogImages.push({
  //     url: `${process.env.APP_URL}/og/en-GB.png`,
  //     width: 1200,
  //     height: 600,
  //   });
  // }

  return {
    title: {
      template: `%s | ${t("name")}`,
      default: t("site.name"),
    },
    description: t("site.description"),
    metadataBase: new URL(process.env.APP_URL),
    // openGraph: {
    //   images: ogImages,
    // },
    alternates: {
      canonical: `${process.env.APP_URL}`,
      languages: {
        "en-GB": `${process.env.APP_URL}/en-GB`,
      },
    },
    // verification: {
    //   google: "T9cIaXr6zYwwHAizh9qhGq1BRrdtfLXLGdoTLsgehi0",
    // },
  };
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng} suppressHydrationWarning>
      {process.env.APP_ENV === "production" && (
        <head>
          {/* <script
            defer
            src="https://unpkg.com/@tinybirdco/flock.js"
            data-token={`${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`}
          /> */}
        </head>
      )}
      <ClarityScript />

      <body
        className={cn(
          inter.className,
          poppins.variable,
          "flex min-w-[320px] flex-col",
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Masthead lng={lng} />
            <Header lng={lng} />
            <>{children}</>
            <Footer lng={lng} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
