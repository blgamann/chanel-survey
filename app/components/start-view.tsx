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

export default function StartView({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-none" role="main">
        <CardHeader>
          <CardTitle className="text-center">
            <span className="block text-xl text-gray-700">
              샤넬과 함께할 당신은
            </span>
            <span className="block text-3xl font-extrabold text-gray-900 mt-2">
              어떤 유형의 사람일까요?
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <div className="flex items-center justify-center gap-1 text-gray-800">
            <DocumentTextIcon className="w-5 h-5" />
            <span>32문항</span>
          </div>
          <p className="text-center text-sm text-gray-800 font-medium">
            :: 나와 가장 유사한 답변을 골라주세요 ::
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            onClick={onStart}
            className="w-full"
            aria-label="성향 테스트 시작하기"
          >
            테스트 시작하기
          </Button>
          <p className="text-sm text-gray-800" aria-live="polite">
            <strong>298</strong>명이 참여했어요.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
