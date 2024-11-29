import Image from "next/image";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StartViewProps {
  onStart: () => void;
}

export default function StartView({ onStart }: StartViewProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-none" role="main">
        <CardHeader>
          <CardTitle className="text-center">
            <span className="block text-xl text-gray-700 font-normal">
              샤넬과 함께할 당신은
            </span>
            <span className="block text-3xl font-extrabold text-gray-900 mt-1">
              어떤 유형의 사람일까요?
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 pt-2">
          <div className="relative w-full h-48">
            <Image
              src="/main.png"
              alt="샤넬 성향 테스트 메인 이미지 - 다양한 샤넬 제품들이 전시되어 있는 모습"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              priority
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1 text-gray-800">
              <DocumentTextIcon className="w-5 h-5 mb-1" />
              <span>32문항</span>
            </div>
            <p className="text-center text-sm text-gray-800 font-medium">
              :: 나와 가장 유사한 답변을 골라주세요 ::
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-2">
          <Button
            onClick={onStart}
            className="w-full"
            aria-label="성향 테스트 시작하기"
          >
            테스트 시작하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
