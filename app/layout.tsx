import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "샤넬과 함께할 당신은?",
  description: "샤넬과 함께할 당신의 성향을 알아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
