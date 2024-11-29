import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "샤넬과 함께할 당신은?",
  description: "샤넬과 함께할 당신의 성향을 알아보세요.",
  openGraph: {
    title: "샤넬과 함께할 당신은?",
    description: "샤넬과 함께할 당신의 성향을 알아보세요.",
    type: "website",
    url: "https://chanel-survey.vercel.app",
    siteName: "샤넬 성향 테스트",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "샤넬 성향 테스트 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "샤넬과 함께할 당신은?",
    description: "샤넬과 함께할 당신의 성향을 알아보세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
