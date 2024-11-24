"use client";

import { useParams } from "next/navigation";
import resultsData from "@/data/results.json";
import { ResultView } from "@/app/components/result-view";

type ResultType = "art-genius" | "happy-cheer" | "idea-maker" | "kind-helper";

export default function ResultPage() {
  const params = useParams();
  const resultType = params.type as ResultType;

  if (!resultsData[resultType]) {
    return (
      <main className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-xl">결과를 찾을 수 없습니다.</div>
      </main>
    );
  }

  return <ResultView resultType={resultType} results={resultsData} />;
}
