import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  M_PLUS_1p,
  Quantico,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mPlus1p = M_PLUS_1p({
  variable: "--font-m-plus-1p-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const quantico = Quantico({
  variable: "--font-quantico-loaded",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "S-Rank",
  description: "S-Rank is the ultimate platform designed for achievement hunters and content creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSansJP.variable} ${mPlus1p.variable} ${quantico.variable} ${zenKakuGothicNew.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
