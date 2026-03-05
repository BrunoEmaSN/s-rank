import type { Metadata } from "next";
import {
  Noto_Sans_JP,
  M_PLUS_1p,
  Quantico,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { getSession } from "@/lib/auth-server";
import { Header } from "@/components/Header";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html
      lang="en"
      className={`${notoSansJP.variable} ${mPlus1p.variable} ${quantico.variable} ${zenKakuGothicNew.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <div className="min-h-screen bg-primary text-foreground">
          <Header session={session ? { user: session.user } : null} />
          {children}
        </div>
      </body>
    </html>
  );
}
