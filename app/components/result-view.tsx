import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResultViewProps {
  resultType: string;
  results: {
    [key: string]: {
      description: string;
      image: string[];
      mainDescription: string[];
      complementaryType: string;
      traits: string[];
    };
  };
}

export function ResultView({ resultType, results }: ResultViewProps) {
  const result = results[resultType];
  const router = useRouter();
  const shareUrl = `${window.location.origin}/result/${resultType}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "샤넬과 함께 할 당신은?",
          text: `나의 결과: ${result.description}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("링크가 복사되었습니다!");
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md border-0 shadow-none"
        role="main"
        aria-labelledby="result-title"
      >
        <CardHeader>
          <CardTitle id="result-title" className="text-center">
            <span className="block text-xl text-gray-700 font-normal">
              샤넬과 함께할 당신은
            </span>
            <span className="block text-3xl font-extrabold text-gray-900 mt-1">
              {result.description}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          <div
            className="relative w-full h-48"
            role="img"
            aria-label={`${result.description}를 표현한 이미지`}
          >
            <Image
              src={result.image[0]}
              alt=""
              fill
              className="object-contain rounded-md"
              priority
            />
          </div>

          <section className="space-y-2" aria-label="성향 설명">
            {result.mainDescription.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 leading-relaxed mt-[-20px]"
              >
                {paragraph}
              </p>
            ))}
          </section>

          <section className="space-y-4" aria-label="상세 특성">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h2 className="font-medium mb-1 flex items-center justify-center gap-2">
                서로 보완할 수 있는 유형
              </h2>
              <p className="text-gray-900 text-lg font-medium">
                [{result.complementaryType}]
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h2 className="font-medium mb-3 flex items-center justify-center gap-2">
                이런 당신은?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {result.traits.map((trait, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white px-4 py-3 rounded-md"
                  >
                    <span role="img" aria-hidden="true">
                      ✔️
                    </span>
                    <span className="pl-2 text-gray-700 text-xs">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleShare}
            className="w-full"
            aria-label="결과 공유하기"
          >
            결과 공유하기
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full border-0 shadow-none text-gray-400"
            aria-label="테스트 다시하기"
          >
            테스트 다시하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
