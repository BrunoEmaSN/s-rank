import type { Metadata } from "next";
import { getSession } from "@/lib/auth-server";
import { Header } from "@/components/Header";
import "./globals.css";

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
