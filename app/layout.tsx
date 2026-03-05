import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ふむ — メンタルケアアプリ",
  description: "AIとの対話で、言語化できないモヤモヤを自己理解の資産に変えるメンタルケアアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
