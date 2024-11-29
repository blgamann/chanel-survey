// page.tsx - 서버 컴포넌트
import { Metadata } from "next";
import results from "@/data/results.json";
import { ResultPageClient } from "@/app/result/[type]/result-page-client";

interface Props {
  params: {
    type: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = results[params.type as keyof typeof results];

  if (!result) {
    return {
      title: "결과를 찾을 수 없습니다",
      description: "올바르지 않은 결과 페이지입니다.",
    };
  }

  return {
    title: `당신은 ${result.description} | 샤넬과 함께할 당신은?`,
    description: result.mainDescription[0],
    openGraph: {
      title: `당신은 ${result.description} | 샤넬과 함께할 당신은?`,
      description: result.mainDescription[0],
      type: "website",
      url: `https://chanel-survey.vercel.app/result/${params.type}`,
      siteName: "샤넬 성향 테스트",
      locale: "ko_KR",
      images: [
        {
          url: result.image[0],
          width: 1200,
          height: 630,
          alt: `${result.description} 결과 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `당신은 ${result.description} | 샤넬과 함께할 당신은?`,
      description: result.mainDescription[0],
      images: [result.image[0]],
    },
  };
}

export default function ResultPage({ params }: Props) {
  return <ResultPageClient params={params} />;
}
