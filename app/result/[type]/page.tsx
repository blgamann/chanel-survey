"use client";

import { ResultView } from "@/app/components/result-view";
import results from "@/data/results.json";
import { useSearchParams } from "next/navigation";

interface Props {
  params: {
    type: string;
  };
}

export default function ResultPage({ params }: Props) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  return (
    <ResultView
      resultType={params.type}
      results={results}
      userData={{
        name: name || "",
        email: email || "",
      }}
    />
  );
}
