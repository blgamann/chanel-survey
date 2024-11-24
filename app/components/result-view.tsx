import { useRouter } from "next/navigation";

interface ResultViewProps {
  resultType: string;
  results: {
    [key: string]: {
      description: string;
      image: string[];
      resultDescription: string;
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
    <main className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">샤넬과 함께할 당신은</p>
          <h1 className="text-2xl font-bold">{result.description}</h1>
        </div>

        <div className="w-48 h-48 bg-[#5B9BD5] rounded-lg mb-8 flex items-center justify-center">
          <img
            src={result.image[0]}
            alt={result.description}
            className="w-36 h-36 object-contain"
          />
        </div>

        <div className="text-center space-y-6 mb-12 max-w-sm">
          {result.resultDescription.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="w-full mb-8">
          <p className="font-medium mb-1">서로 보완할 수 있는 유형</p>
          <p className="text-[#5B9BD5] mb-6">
            Encouraging Cheerleader 명랑한 응원가
          </p>

          <p className="font-medium mb-3">이런 당신은</p>
          <div className="grid grid-cols-2 gap-y-2">
            {[
              "객관적인시선",
              "호율이최고",
              "관찰의아이콘",
              "궁금한게많아요",
            ].map((trait, index) => (
              <div key={index} className="flex items-center">
                <span className="text-[#5B9BD5] mr-2">✓</span>
                <span className="text-gray-700">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            다른 테스트 하러가기
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            처음부터 다시하기
          </button>
        </div>

        <div className="mt-12 opacity-50">
          <img
            src="/oxopolitics-logo.png"
            alt="Powered by OXOPOLITICS"
            className="h-6"
          />
        </div>
      </div>
    </main>
  );
}
